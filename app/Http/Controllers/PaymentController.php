<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Services\MagpieService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    private MagpieService $magpieService;

    public function __construct(MagpieService $magpieService)
    {
        $this->magpieService = $magpieService;
    }

    public function success(Request $request, Order $order)
    {
        $this->authorize('view', $order);

        try {
            $payment = $order->payment;

            if (! $payment) {
                return redirect()->route('orders.show', $order)
                    ->with('error', 'Payment record not found.');
            }

            // Update payment status
            DB::transaction(function () use ($order, $payment) {
                $payment->update([
                    'status' => 'completed',
                    'processed_at' => now(),
                ]);

                $order->update([
                    'status' => 'processing',
                    'completed_at' => now(),
                ]);
            });

            return redirect()->route('orders.show', $order)
                ->with('success', 'Payment completed successfully! Your order is being processed.');

        } catch (\Exception $e) {
            Log::error('Payment success callback failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('orders.show', $order)
                ->with('error', 'There was an issue processing your payment confirmation.');
        }
    }

    public function cancel(Request $request, Order $order)
    {
        $this->authorize('view', $order);

        try {
            $payment = $order->payment;

            if (! $payment) {
                return redirect()->route('orders.show', $order)
                    ->with('error', 'Payment record not found.');
            }

            // Update payment status
            $payment->update([
                'status' => 'cancelled',
            ]);

            return redirect()->route('orders.show', $order)
                ->with('warning', 'Payment was cancelled. You can try again or contact support if needed.');

        } catch (\Exception $e) {
            Log::error('Payment cancel callback failed', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('orders.show', $order)
                ->with('error', 'There was an issue processing the payment cancellation.');
        }
    }

    public function webhook(Request $request)
    {
        try {
            $payload = $request->getContent();
            $signature = $request->header('X-Magpie-Signature');

            // Verify webhook signature (if webhook secret is configured)
            $webhookSecret = config('services.magpie.webhook_secret');
            if ($webhookSecret && ! $this->magpieService->verifyWebhookSignature($payload, $signature, $webhookSecret)) {
                Log::warning('Invalid webhook signature received');

                return response('Invalid signature', 400);
            }

            $data = json_decode($payload, true);

            if (! $data || ! isset($data['type'])) {
                Log::warning('Invalid webhook payload received', ['payload' => $payload]);

                return response('Invalid payload', 400);
            }

            $this->handleWebhookEvent($data);

            return response('OK', 200);

        } catch (\Exception $e) {
            Log::error('Webhook processing failed', [
                'error' => $e->getMessage(),
                'payload' => $request->getContent(),
            ]);

            return response('Internal error', 500);
        }
    }

    private function handleWebhookEvent(array $data): void
    {
        $eventType = $data['type'];
        $eventData = $data['data'] ?? [];

        Log::info('Processing webhook event', ['type' => $eventType, 'data' => $eventData]);

        switch ($eventType) {
            case 'payment.completed':
                $this->handlePaymentCompleted($eventData);
                break;

            case 'payment.failed':
                $this->handlePaymentFailed($eventData);
                break;

            case 'payment.refunded':
                $this->handlePaymentRefunded($eventData);
                break;

            default:
                Log::info('Unhandled webhook event type', ['type' => $eventType]);
                break;
        }
    }

    private function handlePaymentCompleted(array $data): void
    {
        $transactionId = $data['id'] ?? null;
        $metadata = $data['metadata'] ?? [];

        if (! $transactionId) {
            Log::warning('Payment completed webhook missing transaction ID');

            return;
        }

        $payment = Payment::where('magpie_transaction_id', $transactionId)->first();

        if (! $payment) {
            Log::warning('Payment not found for completed transaction', ['transaction_id' => $transactionId]);

            return;
        }

        DB::transaction(function () use ($payment, $data) {
            $payment->update([
                'status' => 'completed',
                'processed_at' => now(),
                'magpie_response' => array_merge($payment->magpie_response ?? [], $data),
            ]);

            $payment->order->update([
                'status' => 'processing',
                'completed_at' => now(),
            ]);
        });

        Log::info('Payment marked as completed via webhook', ['payment_id' => $payment->id]);
    }

    private function handlePaymentFailed(array $data): void
    {
        $transactionId = $data['id'] ?? null;

        if (! $transactionId) {
            Log::warning('Payment failed webhook missing transaction ID');

            return;
        }

        $payment = Payment::where('magpie_transaction_id', $transactionId)->first();

        if (! $payment) {
            Log::warning('Payment not found for failed transaction', ['transaction_id' => $transactionId]);

            return;
        }

        $payment->update([
            'status' => 'failed',
            'magpie_response' => array_merge($payment->magpie_response ?? [], $data),
        ]);

        Log::info('Payment marked as failed via webhook', ['payment_id' => $payment->id]);
    }

    private function handlePaymentRefunded(array $data): void
    {
        $transactionId = $data['id'] ?? null;

        if (! $transactionId) {
            Log::warning('Payment refunded webhook missing transaction ID');

            return;
        }

        $payment = Payment::where('magpie_transaction_id', $transactionId)->first();

        if (! $payment) {
            Log::warning('Payment not found for refunded transaction', ['transaction_id' => $transactionId]);

            return;
        }

        DB::transaction(function () use ($payment, $data) {
            $payment->update([
                'status' => 'refunded',
                'magpie_response' => array_merge($payment->magpie_response ?? [], $data),
            ]);

            // Restore stock for physical products
            foreach ($payment->order->orderItems as $orderItem) {
                if (! $orderItem->product->digital_product) {
                    $orderItem->product->increment('quantity', $orderItem->quantity);
                }
            }

            $payment->order->update(['status' => 'refunded']);
        });

        Log::info('Payment marked as refunded via webhook', ['payment_id' => $payment->id]);
    }
}
