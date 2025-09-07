<?php

namespace App\Http\Controllers\Merchant;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\AnalyticsService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private AnalyticsService $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $store = $user->store;

        // If merchant doesn't have a store yet, redirect to onboarding
        if (! $store) {
            return redirect()->route('merchant.store.create');
        }

        // Check if store needs approval
        if ($store->isPending()) {
            return Inertia::render('Merchant/StoreUnderReview', [
                'store' => $store,
            ]);
        }

        if ($store->isSuspended()) {
            return Inertia::render('Merchant/StoreSuspended', [
                'store' => $store,
            ]);
        }

        // Get date range from request or default to current month
        $dateRange = $this->getDateRange($request);

        // Get comprehensive analytics data
        $analytics = $this->analyticsService->getMerchantDashboardData(
            $store->id,
            $dateRange
        );

        // Get basic store stats for quick overview
        $basicStats = $this->getBasicStats($store);

        return Inertia::render('Merchant/Dashboard', [
            'user' => $user,
            'store' => $store,
            'analytics' => $analytics,
            'basicStats' => $basicStats,
            'dateRange' => [
                'start' => $dateRange['start']->format('Y-m-d'),
                'end' => $dateRange['end']->format('Y-m-d'),
            ],
        ]);
    }

    public function getAnalytics(Request $request)
    {
        $user = $request->user();
        $store = $user->store;

        if (! $store) {
            return response()->json(['error' => 'Store not found'], 404);
        }

        $dateRange = $this->getDateRange($request);
        $analytics = $this->analyticsService->getMerchantDashboardData(
            $store->id,
            $dateRange
        );

        return response()->json($analytics);
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

    private function getBasicStats($store): array
    {
        $totalProducts = Product::where('store_id', $store->id)->count();
        $publishedProducts = Product::where('store_id', $store->id)->published()->count();
        $draftProducts = Product::where('store_id', $store->id)->draft()->count();

        $lowStockProducts = Product::where('store_id', $store->id)
            ->where('quantity', '<=', 5)
            ->where('quantity', '>', 0)
            ->where('digital_product', false)
            ->published()
            ->count();

        $outOfStockProducts = Product::where('store_id', $store->id)
            ->where('quantity', 0)
            ->where('digital_product', false)
            ->published()
            ->count();

        return [
            'total_products' => $totalProducts,
            'published_products' => $publishedProducts,
            'draft_products' => $draftProducts,
            'low_stock_products' => $lowStockProducts,
            'out_of_stock_products' => $outOfStockProducts,
        ];
    }
}
