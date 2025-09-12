import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Modal from 'react-modal';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import FlashMessages from '@/components/FlashMessages';
import { User } from '@/types';

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
    defaultBillingInfo: {
        name?: string;
        email?: string;
        address?: string;
        city?: string;
        postal_code?: string;
        country?: string;
    };
    flash?: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
}

export default function CheckoutIndex({ cartItems, storeGroups, totalAmount, formattedTotal, defaultBillingInfo, flash }: CheckoutProps) {
    const [isRedirecting, setIsRedirecting] = useState(false);
    const { auth } = usePage().props as { auth?: { user: User } };
    
    const { data, setData, post, processing, errors } = useForm({
        billing_name: defaultBillingInfo?.name || auth?.user?.name || '',
        billing_email: defaultBillingInfo?.email || auth?.user?.email || '',
        billing_address: defaultBillingInfo?.address || '',
        billing_city: defaultBillingInfo?.city || '',
        billing_postal_code: defaultBillingInfo?.postal_code || '',
        billing_country: defaultBillingInfo?.country || 'Philippines',
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    const formatCentavos = (centavos: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(centavos / 100);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!processing && !isRedirecting) {
            setIsRedirecting(true);
            
            try {
                // Refresh CSRF token before submission
                const response = await fetch('/csrf-token', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                let freshToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                
                if (response.ok) {
                    const tokenData = await response.json();
                    if (tokenData.csrf_token) {
                        freshToken = tokenData.csrf_token;
                        // Update the meta tag with fresh token
                        const metaTag = document.querySelector('meta[name="csrf-token"]');
                        if (metaTag && freshToken) {
                            metaTag.setAttribute('content', freshToken);
                        }
                    }
                }
                
                // For payment flows that redirect to external services (like Magpie),
                // we need to use a regular form submission instead of AJAX to allow
                // the browser to properly handle the external redirect
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = '/orders/checkout';
                
                // Add fresh CSRF token
                if (freshToken) {
                    const csrfInput = document.createElement('input');
                    csrfInput.type = 'hidden';
                    csrfInput.name = '_token';
                    csrfInput.value = freshToken;
                    form.appendChild(csrfInput);
                }
                
                // Add form data
                Object.entries(data).forEach(([key, value]) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = value;
                    form.appendChild(input);
                });
                
                // Submit the form
                document.body.appendChild(form);
                form.submit();
            } catch (error) {
                console.error('Failed to refresh CSRF token:', error);
                setIsRedirecting(false);
                // Fallback to original submission if token refresh fails
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = '/orders/checkout';
                
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                if (csrfToken) {
                    const csrfInput = document.createElement('input');
                    csrfInput.type = 'hidden';
                    csrfInput.name = '_token';
                    csrfInput.value = csrfToken;
                    form.appendChild(csrfInput);
                }
                
                Object.entries(data).forEach(([key, value]) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = value;
                    form.appendChild(input);
                });
                
                document.body.appendChild(form);
                form.submit();
            }
        }
    };

    return (
        <StorefrontLayout>
            <Head title="Checkout" />
            
            {/* Payment Redirect Loading Modal with Blur */}
            {isRedirecting && (
                <div className="fixed inset-0 flex items-center justify-center z-50" style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(8px)'
                }}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
                        <div className="flex justify-center mb-4">
                            <svg className="animate-spin h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Redirecting to Payment
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Please wait while we redirect you to Magpie's secure payment page...
                        </p>
                    </div>
                </div>
            )}

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>
                    
                    <FlashMessages flash={flash} />

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
                                                {formatCentavos(item.total_price)}
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
                                            name="billing_name"
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
                                            name="billing_email"
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
                                            name="billing_address"
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
                                                name="billing_city"
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
                                                name="billing_postal_code"
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
                                            name="billing_country"
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
                                            disabled={processing || isRedirecting}
                                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Processing...' : `Place Order - ${formattedTotal || '₱0.00'}`}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}