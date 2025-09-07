import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/app-layout';

interface CartItem {
    id: string;
    quantity: number;
    total_price: number;
    product: {
        id: string;
        name: string;
        price: number;
        images?: string[];
    };
    store?: {
        id: string;
        name: string;
    };
}

interface CheckoutProps {
    cartItems: CartItem[];
    storeGroups: Record<string, CartItem[]>;
    totalAmount: number;
    formattedTotal: string;
}

export default function CheckoutIndex({ cartItems, storeGroups, totalAmount, formattedTotal }: CheckoutProps) {
    const { data, setData, post, processing, errors } = useForm({
        billing_name: '',
        billing_email: '',
        billing_address: '',
        billing_city: '',
        billing_postal_code: '',
        billing_country: '',
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount / 100);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('orders.store'));
    };

    return (
        <AppLayout>
            <Head title="Checkout" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Order Summary */}
                        <div className="order-2 lg:order-1">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Summary</h2>
                                <div className="space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-4">
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {item.product.name}
                                                </h3>
                                                {item.store && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Sold by {item.store.name}
                                                    </p>
                                                )}
                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                    <span>Qty: {item.quantity}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{formatCurrency(item.product.price)}</span>
                                                </div>
                                            </div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(item.total_price)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
                                    <div className="flex items-center justify-between text-lg font-medium text-gray-900 dark:text-white">
                                        <span>Total</span>
                                        <span>{formattedTotal}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Billing Information */}
                        <div className="order-1 lg:order-2">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Billing Information</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.billing_name}
                                            onChange={(e) => setData('billing_name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.billing_name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.billing_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={data.billing_email}
                                            onChange={(e) => setData('billing_email', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.billing_email && (
                                            <p className="text-red-500 text-sm mt-1">{errors.billing_email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            value={data.billing_address}
                                            onChange={(e) => setData('billing_address', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.billing_address && (
                                            <p className="text-red-500 text-sm mt-1">{errors.billing_address}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                value={data.billing_city}
                                                onChange={(e) => setData('billing_city', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                                required
                                            />
                                            {errors.billing_city && (
                                                <p className="text-red-500 text-sm mt-1">{errors.billing_city}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Postal Code
                                            </label>
                                            <input
                                                type="text"
                                                value={data.billing_postal_code}
                                                onChange={(e) => setData('billing_postal_code', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                                required
                                            />
                                            {errors.billing_postal_code && (
                                                <p className="text-red-500 text-sm mt-1">{errors.billing_postal_code}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            value={data.billing_country}
                                            onChange={(e) => setData('billing_country', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.billing_country && (
                                            <p className="text-red-500 text-sm mt-1">{errors.billing_country}</p>
                                        )}
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Processing...' : `Place Order - ${formattedTotal}`}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}