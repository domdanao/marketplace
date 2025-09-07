<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Services\MagpieService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with(['orderItems.product', 'orderItems.store'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);

        $order->load(['orderItems.product', 'orderItems.store', 'payment']);

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }

    public function checkout(Request $request)
    {
        $cartItems = Cart::where('user_id', $request->user()->id)
            ->with(['product.store'])
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Your cart is empty.');
        }

        // Group by store for separate order items
        $storeGroups = $cartItems->groupBy('product.store_id');
        $totalAmount = $cartItems->sum('total_price');

        return Inertia::render('Checkout/Index', [
            'cartItems' => $cartItems,
            'storeGroups' => $storeGroups,
            'totalAmount' => $totalAmount,
            'formattedTotal' => '$'.number_format($totalAmount / 100, 2),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'billing_name' => ['required', 'string', 'max:255'],
            'billing_email' => ['required', 'email', 'max:255'],
            'billing_address' => ['required', 'string', 'max:500'],
            'billing_city' => ['required', 'string', 'max:100'],
            'billing_postal_code' => ['required', 'string', 'max:20'],
            'billing_country' => ['required', 'string', 'max:100'],
        ]);

        $cartItems = Cart::where('user_id', $request->user()->id)
            ->with(['product'])
            ->get();

        if ($cartItems->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Your cart is empty.');
        }

        // Validate stock availability
        foreach ($cartItems as $cartItem) {
            if (! $cartItem->product->isPublished()) {
                return back()->with('error', "Product '{$cartItem->product->name}' is no longer available.");
            }

            if (! $cartItem->product->digital_product && $cartItem->quantity > $cartItem->product->quantity) {
                return back()->with('error', "Not enough stock for '{$cartItem->product->name}'.");
            }
        }

        return DB::transaction(function () use ($request, $cartItems) {
            $totalAmount = $cartItems->sum('total_price');
            $magpieService = new MagpieService;

            // Create main order
            $order = Order::create([
                'user_id' => $request->user()->id,
                'order_number' => 'ORD-'.strtoupper(uniqid()),
                'status' => 'pending',
                'subtotal' => $totalAmount,
                'total_amount' => $totalAmount,
                'billing_info' => [
                    'name' => $request->billing_name,
                    'email' => $request->billing_email,
                    'address' => $request->billing_address,
                    'city' => $request->billing_city,
                    'postal_code' => $request->billing_postal_code,
                    'country' => $request->billing_country,
                ],
            ]);

            // Create order items for each cart item
            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'store_id' => $cartItem->product->store_id,
                    'product_name' => $cartItem->product->name,
                    'product_price' => $cartItem->product->price,
                    'quantity' => $cartItem->quantity,
                    'total_price' => $cartItem->total_price,
                ]);

                // Update product stock for physical products
                if (! $cartItem->product->digital_product) {
                    $cartItem->product->decrement('quantity', $cartItem->quantity);
                }
            }

            // Create payment record
            $payment = Payment::create([
                'order_id' => $order->id,
                'amount' => $totalAmount / 100, // Convert centavos to pesos
                'currency' => 'PHP',
                'status' => 'pending',
            ]);

            try {
                // Create Magpie checkout session
                $checkoutResponse = $magpieService->createCheckoutSession([
                    'amount' => $totalAmount,
                    'currency' => 'PHP',
                    'description' => "Order #{$order->order_number}",
                    'success_url' => route('payment.success', ['order' => $order->id]),
                    'cancel_url' => route('payment.cancel', ['order' => $order->id]),
                    'metadata' => [
                        'order_id' => $order->id,
                        'payment_id' => $payment->id,
                    ],
                ]);

                // Update payment with Magpie transaction ID
                $payment->update([
                    'magpie_transaction_id' => $checkoutResponse['id'] ?? null,
                    'magpie_response' => $checkoutResponse,
                ]);

                // Clear cart
                Cart::where('user_id', $request->user()->id)->delete();

                // Redirect to Magpie checkout
                if (isset($checkoutResponse['checkout_url'])) {
                    return redirect($checkoutResponse['checkout_url']);
                }

                // Fallback: redirect to order page
                return redirect()->route('orders.show', $order)
                    ->with('success', 'Order placed successfully! Order #'.$order->order_number);

            } catch (\Exception $e) {
                Log::error('Payment processing failed', [
                    'order_id' => $order->id,
                    'error' => $e->getMessage(),
                ]);

                $payment->update(['status' => 'failed']);

                return redirect()->route('orders.show', $order)
                    ->with('error', 'Payment processing failed. Please try again or contact support.');
            }
        });
    }

    public function cancel(Order $order)
    {
        $this->authorize('update', $order);

        if ($order->status !== 'pending') {
            return back()->with('error', 'Only pending orders can be cancelled.');
        }

        return DB::transaction(function () use ($order) {
            // Restore stock for physical products
            foreach ($order->orderItems as $orderItem) {
                if (! $orderItem->product->digital_product) {
                    $orderItem->product->increment('quantity', $orderItem->quantity);
                }
            }

            $order->update(['status' => 'cancelled']);

            return back()->with('success', 'Order cancelled successfully.');
        });
    }
}
