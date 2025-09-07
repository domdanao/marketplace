<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = $this->getPlatformStats();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }

    public function users(Request $request)
    {
        $query = User::query();

        // Filter by role
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        // Search by name or email
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        $users = $query->withCount(['orders', 'store'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['role', 'search']),
        ]);
    }

    public function stores(Request $request)
    {
        $query = Store::with(['user', 'products']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search by name or description
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        $stores = $query->withCount(['products', 'orderItems'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Stores/Index', [
            'stores' => $stores,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function approveStore(Store $store)
    {
        $store->update(['status' => 'approved']);

        return back()->with('success', 'Store approved successfully.');
    }

    public function suspendStore(Store $store)
    {
        $store->update(['status' => 'suspended']);

        return back()->with('success', 'Store suspended successfully.');
    }

    public function orders(Request $request)
    {
        $query = Order::with(['user', 'orderItems.product', 'payment']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        // Search by order number or user
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('order_number', 'like', "%{$request->search}%")
                    ->orWhereHas('user', function ($userQuery) use ($request) {
                        $userQuery->where('name', 'like', "%{$request->search}%")
                            ->orWhere('email', 'like', "%{$request->search}%");
                    });
            });
        }

        $orders = $query->latest()
            ->paginate(20);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'start_date', 'end_date', 'search']),
        ]);
    }

    public function analytics(Request $request)
    {
        $dateRange = $this->getDateRange($request);
        $analytics = $this->getPlatformAnalytics($dateRange);

        return Inertia::render('Admin/Analytics', [
            'analytics' => $analytics,
            'dateRange' => [
                'start' => $dateRange['start']->format('Y-m-d'),
                'end' => $dateRange['end']->format('Y-m-d'),
            ],
        ]);
    }

    public function categories()
    {
        $categories = Category::withCount(['products'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function payments(Request $request)
    {
        $query = Payment::with(['order.user']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $payments = $query->latest()
            ->paginate(20);

        $paymentStats = [
            'total_payments' => Payment::count(),
            'completed_payments' => Payment::where('status', 'completed')->count(),
            'failed_payments' => Payment::where('status', 'failed')->count(),
            'total_revenue' => Payment::where('status', 'completed')->sum('amount'),
        ];

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $payments,
            'paymentStats' => $paymentStats,
            'filters' => $request->only(['status', 'start_date', 'end_date']),
        ]);
    }

    private function getPlatformStats(): array
    {
        $currentMonth = Carbon::now()->startOfMonth();
        $previousMonth = Carbon::now()->subMonth()->startOfMonth();

        // User stats
        $totalUsers = User::count();
        $merchantsCount = User::where('role', 'merchant')->count();
        $buyersCount = User::where('role', 'buyer')->count();
        $newUsersThisMonth = User::where('created_at', '>=', $currentMonth)->count();

        // Store stats
        $totalStores = Store::count();
        $activeStores = Store::where('status', 'approved')->count();
        $pendingStores = Store::where('status', 'pending')->count();
        $suspendedStores = Store::where('status', 'suspended')->count();

        // Product stats
        $totalProducts = Product::count();
        $publishedProducts = Product::where('status', 'published')->count();
        $lowStockProducts = Product::where('quantity', '<=', 5)
            ->where('digital_product', false)
            ->count();

        // Order stats
        $totalOrders = Order::count();
        $ordersThisMonth = Order::where('created_at', '>=', $currentMonth)->count();
        $ordersLastMonth = Order::whereBetween('created_at', [
            $previousMonth,
            $previousMonth->copy()->endOfMonth(),
        ])->count();

        // Revenue stats
        $totalRevenue = OrderItem::whereHas('order', function ($query) {
            $query->whereIn('status', ['processing', 'completed']);
        })->sum('total_price');

        $revenueThisMonth = OrderItem::whereHas('order', function ($query) use ($currentMonth) {
            $query->whereIn('status', ['processing', 'completed'])
                ->where('created_at', '>=', $currentMonth);
        })->sum('total_price');

        $revenueLastMonth = OrderItem::whereHas('order', function ($query) use ($previousMonth) {
            $query->whereIn('status', ['processing', 'completed'])
                ->whereBetween('created_at', [
                    $previousMonth,
                    $previousMonth->copy()->endOfMonth(),
                ]);
        })->sum('total_price');

        // Payment stats
        $completedPayments = Payment::where('status', 'completed')->count();
        $failedPayments = Payment::where('status', 'failed')->count();
        $paymentSuccessRate = $totalOrders > 0
            ? ($completedPayments / $totalOrders) * 100
            : 0;

        // Recent activities
        $recentOrders = Order::with(['user', 'orderItems'])
            ->latest()
            ->limit(5)
            ->get();

        $recentUsers = User::latest()
            ->limit(5)
            ->get();

        $recentStores = Store::with(['user'])
            ->latest()
            ->limit(5)
            ->get();

        return [
            'users' => [
                'total' => $totalUsers,
                'merchants' => $merchantsCount,
                'buyers' => $buyersCount,
                'new_this_month' => $newUsersThisMonth,
            ],
            'stores' => [
                'total' => $totalStores,
                'approved' => $activeStores,
                'pending' => $pendingStores,
                'suspended' => $suspendedStores,
            ],
            'products' => [
                'total' => $totalProducts,
                'published' => $publishedProducts,
                'low_stock' => $lowStockProducts,
            ],
            'orders' => [
                'total' => $totalOrders,
                'this_month' => $ordersThisMonth,
                'last_month' => $ordersLastMonth,
                'growth_percentage' => $ordersLastMonth > 0
                    ? (($ordersThisMonth - $ordersLastMonth) / $ordersLastMonth) * 100
                    : ($ordersThisMonth > 0 ? 100 : 0),
            ],
            'revenue' => [
                'total' => $totalRevenue,
                'this_month' => $revenueThisMonth,
                'last_month' => $revenueLastMonth,
                'growth_percentage' => $revenueLastMonth > 0
                    ? (($revenueThisMonth - $revenueLastMonth) / $revenueLastMonth) * 100
                    : ($revenueThisMonth > 0 ? 100 : 0),
            ],
            'payments' => [
                'completed' => $completedPayments,
                'failed' => $failedPayments,
                'success_rate' => round($paymentSuccessRate, 2),
            ],
            'recent_activities' => [
                'orders' => $recentOrders,
                'users' => $recentUsers,
                'stores' => $recentStores,
            ],
        ];
    }

    private function getPlatformAnalytics(array $dateRange): array
    {
        $startDate = $dateRange['start'];
        $endDate = $dateRange['end'];

        // Daily metrics
        $dailyStats = Order::selectRaw('
                DATE(created_at) as date,
                COUNT(*) as orders_count,
                COUNT(DISTINCT user_id) as unique_customers
            ')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $dailyRevenue = OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
            ->selectRaw('
                DATE(orders.created_at) as date,
                SUM(order_items.total_price) as revenue
            ')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->whereIn('orders.status', ['processing', 'completed'])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        // Fill missing dates
        $analytics = collect();
        $current = $startDate->copy();
        while ($current->lte($endDate)) {
            $dateKey = $current->format('Y-m-d');
            $analytics->put($dateKey, [
                'date' => $dateKey,
                'orders' => $dailyStats->get($dateKey)?->orders_count ?? 0,
                'customers' => $dailyStats->get($dateKey)?->unique_customers ?? 0,
                'revenue' => $dailyRevenue->get($dateKey)?->revenue ?? 0,
            ]);
            $current->addDay();
        }

        // Top performing stores
        $topStores = Store::select('stores.*')
            ->selectRaw('SUM(order_items.total_price) as total_revenue')
            ->selectRaw('COUNT(DISTINCT orders.id) as total_orders')
            ->join('order_items', 'stores.id', '=', 'order_items.store_id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->whereIn('orders.status', ['processing', 'completed'])
            ->groupBy('stores.id', 'stores.name', 'stores.slug', 'stores.description', 'stores.logo', 'stores.status', 'stores.user_id', 'stores.created_at', 'stores.updated_at')
            ->orderByDesc('total_revenue')
            ->limit(10)
            ->get();

        // Category performance
        $categoryStats = Category::select('categories.*')
            ->selectRaw('COUNT(DISTINCT products.id) as products_count')
            ->selectRaw('SUM(order_items.total_price) as revenue')
            ->selectRaw('SUM(order_items.quantity) as units_sold')
            ->leftJoin('products', 'categories.id', '=', 'products.category_id')
            ->leftJoin('order_items', 'products.id', '=', 'order_items.product_id')
            ->leftJoin('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->whereIn('orders.status', ['processing', 'completed'])
            ->groupBy('categories.id', 'categories.name', 'categories.slug', 'categories.description', 'categories.created_at', 'categories.updated_at')
            ->orderByDesc('revenue')
            ->get();

        return [
            'daily_data' => $analytics->values(),
            'top_stores' => $topStores,
            'category_performance' => $categoryStats,
            'summary' => [
                'total_revenue' => $analytics->sum('revenue'),
                'total_orders' => $analytics->sum('orders'),
                'total_customers' => $analytics->sum('customers'),
                'average_daily_revenue' => $analytics->avg('revenue'),
            ],
        ];
    }

    private function getDateRange(Request $request): array
    {
        $start = $request->input('start_date')
            ? Carbon::parse($request->input('start_date'))->startOfDay()
            : Carbon::now()->startOfMonth();

        $end = $request->input('end_date')
            ? Carbon::parse($request->input('end_date'))->endOfDay()
            : Carbon::now()->endOfMonth();

        return [
            'start' => $start,
            'end' => $end,
        ];
    }
}
