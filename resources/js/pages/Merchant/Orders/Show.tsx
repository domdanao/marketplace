import { Head, Link } from '@inertiajs/react';
import MerchantLayout from '@/Layouts/MerchantLayout';

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
        images?: string[];
    };
}

interface Order {
    id: string;
    order_number: string;
    status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
    subtotal: number;
    tax_amount?: number;
    total_amount: number;
    billing_info?: {
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
    user: {
        id: string;
        name: string;
        email: string;
    };
}

interface Props {
    order: Order;
}

export default function MerchantOrderShow({ order }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    };

    const storeTotal = order.order_items.reduce((sum, item) => sum + item.total_price, 0);

    return (
        <MerchantLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Order Details
                    </h2>
                    <Link
                        href="/merchant/orders"
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Orders
                    </Link>
                </div>
            }
        >
            <Head title={`Order ${order.order_number}`} />

            <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    Order #{order.order_number}
                                </h3>
                                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                    <p>Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</p>
                                    {order.completed_at && (
                                        <p>Completed on {new Date(order.completed_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}</p>
                                    )}
                                </div>
                            </div>
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Customer Information */}
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Customer Information</h4>
                                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                    <p><span className="font-medium">Name:</span> {order.user.name}</p>
                                    <p><span className="font-medium">Email:</span> {order.user.email}</p>
                                </div>
                            </div>

                            {/* Billing Information */}
                            {order.billing_info && (
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Billing Address</h4>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        <p>{order.billing_info.name}</p>
                                        <p>{order.billing_info.address}</p>
                                        <p>{order.billing_info.city}, {order.billing_info.postal_code}</p>
                                        <p>{order.billing_info.country}</p>
                                        <p>{order.billing_info.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                            Items from Your Store
                        </h3>
                        <div className="space-y-4">
                            {order.order_items.map((item) => (
                                <div key={item.id} className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    {/* Product Image */}
                                    {item.product?.images && item.product.images.length > 0 ? (
                                        <img
                                            src={item.product.images[0]}
                                            alt={item.product_name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                                    {item.product_name}
                                                </h4>
                                                <div className="text-sm text-gray-600 dark:text-gray-400 space-x-2">
                                                    <span>Qty: {item.quantity}</span>
                                                    <span>•</span>
                                                    <span>{formatCurrency(item.product_price)} each</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {formatCurrency(item.total_price / 100)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Store Total */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                                    Total for Your Store:
                                </span>
                                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                    {formatCurrency(storeTotal / 100)}
                                </span>
                            </div>
                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Full order total: {formatCurrency(order.total_amount / 100)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MerchantLayout>
    );
}