<?php

namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\StoreProductRequest;
use App\Http\Requests\Merchant\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $store = $request->user()->store;

        if (! $store) {
            return redirect()->route('merchant.store.create');
        }

        $products = Product::where('store_id', $store->id)
            ->with(['category'])
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->category, function ($query, $category) {
                $query->whereHas('category', function ($q) use ($category) {
                    $q->where('slug', $category);
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Merchant/Products/Index', [
            'products' => $products,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'category' => $request->category,
            ],
        ]);
    }

    public function create()
    {
        $user = auth()->user();
        $store = $user->store;

        if (! $store || ! $store->isApproved()) {
            return redirect()->route('merchant.dashboard')
                ->with('error', 'Your store must be approved before you can add products.');
        }

        $categories = Category::orderBy('name')->get();

        return Inertia::render('Merchant/Products/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $store = $request->user()->store;

        if (! $store || ! $store->isApproved()) {
            return redirect()->route('merchant.dashboard')
                ->with('error', 'Your store must be approved before you can add products.');
        }

        $product = Product::create([
            'store_id' => $store->id,
            'category_id' => $request->category_id,
            'name' => $request->name,
            'slug' => str($request->name)->slug(),
            'description' => $request->description,
            'price' => $request->price,
            'quantity' => $request->quantity,
            'digital_product' => $request->boolean('digital_product', false),
            'download_url' => $request->digital_product ? $request->download_url : null,
            'status' => 'draft',
        ]);

        return redirect()->route('merchant.products.show', $product)
            ->with('success', 'Product created successfully.');
    }

    public function show(Product $product)
    {
        $this->authorize('view', $product);

        return Inertia::render('Merchant/Products/Show', [
            'product' => $product->load(['category', 'store']),
        ]);
    }

    public function edit(Product $product)
    {
        $this->authorize('update', $product);

        $categories = Category::orderBy('name')->get();

        return Inertia::render('Merchant/Products/Edit', [
            'product' => $product->load('category'),
            'categories' => $categories,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $this->authorize('update', $product);

        $product->update([
            'category_id' => $request->category_id,
            'name' => $request->name,
            'slug' => str($request->name)->slug(),
            'description' => $request->description,
            'price' => $request->price,
            'quantity' => $request->quantity,
            'digital_product' => $request->boolean('digital_product', false),
            'download_url' => $request->digital_product ? $request->download_url : null,
        ]);

        return redirect()->route('merchant.products.show', $product)
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);

        $product->delete();

        return redirect()->route('merchant.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    public function publish(Product $product)
    {
        $this->authorize('update', $product);

        $product->update(['status' => 'published']);

        return back()->with('success', 'Product published successfully.');
    }

    public function unpublish(Product $product)
    {
        $this->authorize('update', $product);

        $product->update(['status' => 'draft']);

        return back()->with('success', 'Product unpublished successfully.');
    }
}
