import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/app-layout';

interface OrderItem {
    id: string;
    product_name: string;
    product_price: number;
    quantity: number;
    total_price: number;
    product?: {
        id: string;
        name: string;
        slug: string;
    };
    store?: {
        id: string;
        name: string;
    };
}

interface Payment {
    id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
    magpie_transaction_id?: string;
    processed_at?: string;
}

interface Order {
    id: string;
    order_number: string;
    status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
    subtotal: number;
    tax_amount?: number;
    total_amount: number;
    billing_info: {
        name: string;
        email: string;
        address: string;
        city: string;
        postal_code: string;
        country: string;
    };
    created_at: string;
    completed_at?: string;
    order_items: OrderItem[];
    payment?: Payment;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

interface OrderShowProps {
    order: Order;
}

export default function OrderShow({ order }: OrderShowProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount / 100); // Convert from cents
    };

    const getStatusColor = (status: string) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentStatusColor = (status: string) => {
        const colors = {
            pending: 'text-yellow-600 dark:text-yellow-400',
            processing: 'text-blue-600 dark:text-blue-400',
            completed: 'text-green-600 dark:text-green-400',
            failed: 'text-red-600 dark:text-red-400',
            cancelled: 'text-red-600 dark:text-red-400',
            refunded: 'text-purple-600 dark:text-purple-400',
        };
        return colors[status as keyof typeof colors] || 'text-gray-600';
    };

    return (
        <AppLayout>
            <Head title={`Order ${order.order_number}`} />

            <div className="space-y-6 py-6">
                {/* Order Header */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Order {order.order_number}
                                </h1>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(order.total_amount)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Order Items</h2>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700">
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {order.order_items.map((item) => (
                                        <li key={item.id} className="px-4 py-6 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {item.product_name}
                                                    </h3>
                                                    {item.store && (
                                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                            Sold by {item.store.name}
                                                        </p>
                                                    )}
                                                    <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <span>Qty: {item.quantity}</span>
                                                        <span className="mx-2">•</span>
                                                        <span>{formatCurrency(item.product_price)} each</span>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {formatCurrency(item.total_price)}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary & Details */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Order Summary</h2>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
                                <dl className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-gray-600 dark:text-gray-400">Subtotal</dt>
                                        <dd className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(order.subtotal)}
                                        </dd>
                                    </div>
                                    {order.tax_amount && (
                                        <div className="flex items-center justify-between">
                                            <dt className="text-sm text-gray-600 dark:text-gray-400">Tax</dt>
                                            <dd className="text-sm font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(order.tax_amount)}
                                            </dd>
                                        </div>
                                    )}
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex items-center justify-between">
                                        <dt className="text-base font-medium text-gray-900 dark:text-white">Total</dt>
                                        <dd className="text-base font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(order.total_amount)}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* Payment Information */}
                        {order.payment && (
                            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                                <div className="px-4 py-5 sm:px-6">
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Payment</h2>
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
                                    <dl className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <dt className="text-sm text-gray-600 dark:text-gray-400">Status</dt>
                                            <dd className={`text-sm font-medium ${getPaymentStatusColor(order.payment.status)}`}>
                                                {order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}
                                            </dd>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <dt className="text-sm text-gray-600 dark:text-gray-400">Amount</dt>
                                            <dd className="text-sm font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(order.payment.amount * 100)} {order.payment.currency}
                                            </dd>
                                        </div>
                                        {order.payment.magpie_transaction_id && (
                                            <div className="flex items-center justify-between">
                                                <dt className="text-sm text-gray-600 dark:text-gray-400">Transaction ID</dt>
                                                <dd className="text-sm font-mono text-gray-900 dark:text-white">
                                                    {order.payment.magpie_transaction_id}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            </div>
                        )}

                        {/* Billing Information */}
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Billing Address</h2>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
                                <address className="text-sm text-gray-600 dark:text-gray-400 not-italic">
                                    <div className="font-medium text-gray-900 dark:text-white">{order.billing_info.name}</div>
                                    <div>{order.billing_info.address}</div>
                                    <div>{order.billing_info.city}, {order.billing_info.postal_code}</div>
                                    <div>{order.billing_info.country}</div>
                                    <div className="mt-2">{order.billing_info.email}</div>
                                </address>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}