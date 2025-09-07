import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

interface Stats {
    users: {
        total: number;
        merchants: number;
        buyers: number;
        new_this_month: number;
    };
    stores: {
        total: number;
        active: number;
        pending: number;
        suspended: number;
    };
    products: {
        total: number;
        published: number;
        low_stock: number;
    };
    orders: {
        total: number;
        this_month: number;
        last_month: number;
        growth_percentage: number;
    };
    revenue: {
        total: number;
        this_month: number;
        last_month: number;
        growth_percentage: number;
    };
    payments: {
        completed: number;
        failed: number;
        success_rate: number;
    };
    recent_activities: {
        orders: any[];
        users: any[];
        stores: any[];
    };
}

interface Props {
    stats: Stats;
}

export default function AdminDashboard({ stats }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatGrowth = (percentage: number) => {
        const sign = percentage >= 0 ? '+' : '';
        return `${sign}${percentage.toFixed(1)}%`;
    };

    const getGrowthColor = (percentage: number) => {
        return percentage >= 0 ? 'text-green-600' : 'text-red-600';
    };

    return (
        <AdminLayout
            header={
                <div>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Admin Dashboard
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Overview of your marketplace platform
                    </p>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Users */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <span className="text-2xl">👥</span>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Total Users
                                        </dt>
                                        <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {stats.users.total.toLocaleString()}
                                        </dd>
                                        <dd className="text-sm text-gray-600 dark:text-gray-400">
                                            {stats.users.merchants} merchants, {stats.users.buyers} buyers
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stores */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <span className="text-2xl">🏪</span>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Active Stores
                                        </dt>
                                        <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {stats.stores.active.toLocaleString()}
                                        </dd>
                                        <dd className="text-sm text-gray-600 dark:text-gray-400">
                                            {stats.stores.pending} pending approval
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Revenue */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <span className="text-2xl">💰</span>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Total Revenue
                                        </dt>
                                        <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {formatCurrency(stats.revenue.total)}
                                        </dd>
                                        <dd className={`text-sm ${getGrowthColor(stats.revenue.growth_percentage)}`}>
                                            {formatGrowth(stats.revenue.growth_percentage)} this month
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Orders */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <span className="text-2xl">📦</span>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                            Total Orders
                                        </dt>
                                        <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {stats.orders.total.toLocaleString()}
                                        </dd>
                                        <dd className={`text-sm ${getGrowthColor(stats.orders.growth_percentage)}`}>
                                            {formatGrowth(stats.orders.growth_percentage)} this month
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                                Recent Orders
                            </h3>
                            <div className="space-y-3">
                                {stats.recent_activities.orders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                #{order.order_number}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {order.user?.name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(order.total_amount)}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {order.status}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                                Platform Health
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Payment Success Rate</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {stats.payments.success_rate}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Published Products</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {stats.products.published.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Low Stock Items</span>
                                    <span className="text-sm font-medium text-red-600">
                                        {stats.products.low_stock}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">New Users This Month</span>
                                    <span className="text-sm font-medium text-green-600">
                                        {stats.users.new_this_month}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}