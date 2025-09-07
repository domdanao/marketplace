import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';

interface CartItem {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        images: string[];
        quantity: number;
        digital_files?: string[];
        store: {
            name: string;
            slug: string;
        };
    };
    total_price: number;
}

interface Props {
    cartItems: CartItem[];
    cartTotal: number;
    cartCount: number;
}

export default function CartIndex({ cartItems, cartTotal, cartCount }: Props) {
    const [loadingItems, setLoadingItems] = useState<string[]>([]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const updateQuantity = (cartItemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        
        setLoadingItems(prev => [...prev, cartItemId]);
        router.put(`/cart/${cartItemId}`, {
            quantity: newQuantity,
        }, {
            onFinish: () => setLoadingItems(prev => prev.filter(id => id !== cartItemId)),
        });
    };

    const removeItem = (cartItemId: string) => {
        setLoadingItems(prev => [...prev, cartItemId]);
        router.delete(`/cart/${cartItemId}`, {
            onFinish: () => setLoadingItems(prev => prev.filter(id => id !== cartItemId)),
        });
    };

    const clearCart = () => {
        router.delete('/cart', {
            onBefore: () => confirm('Are you sure you want to clear your cart?'),
        });
    };

    const proceedToCheckout = () => {
        router.get('/orders/checkout');
    };

    const isDigitalProduct = (product: CartItem['product']) => {
        return product.digital_files && product.digital_files.length > 0;
    };

    if (cartItems.length === 0) {
        return (
            <StorefrontLayout>
                <Head title="Shopping Cart - Marketplace" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="text-8xl mb-4">🛒</div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Your cart is empty
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Looks like you haven't added any items to your cart yet.
                        </p>
                        <Link 
                            href="/products" 
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </StorefrontLayout>
        );
    }

    return (
        <StorefrontLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Shopping Cart
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>
                    <button
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                    >
                        Clear Cart
                    </button>
                </div>
            }
        >
            <Head title="Shopping Cart - Marketplace" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="p-6">
                                        <div className="flex items-center">
                                            <Link 
                                                href={`/products/${item.product.slug}`}
                                                className="flex-shrink-0"
                                            >
                                                <img 
                                                    src={item.product.images[0] || '/placeholder-product.jpg'} 
                                                    alt={item.product.name}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                            </Link>
                                            
                                            <div className="ml-6 flex-1">
                                                <div className="flex justify-between">
                                                    <div className="flex-1">
                                                        <Link 
                                                            href={`/products/${item.product.slug}`}
                                                            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                                                        >
                                                            {item.product.name}
                                                        </Link>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                            by {item.product.store.name}
                                                        </p>
                                                        <div className="flex items-center mt-2">
                                                            <span className="text-lg font-bold text-indigo-600">
                                                                {formatPrice(item.product.price)}
                                                            </span>
                                                            {isDigitalProduct(item.product) && (
                                                                <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                                                    Digital
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                            {formatPrice(item.total_price)}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center justify-between mt-4">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center">
                                                        <label className="text-sm text-gray-700 dark:text-gray-300 mr-3">
                                                            Qty:
                                                        </label>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1 || loadingItems.includes(item.id)}
                                                            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-gray-200 font-bold py-1 px-2 rounded-l"
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max={isDigitalProduct(item.product) ? 1 : item.product.quantity}
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                                            disabled={loadingItems.includes(item.id)}
                                                            className="bg-gray-50 dark:bg-gray-700 border-t border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-center py-1 px-2 w-16"
                                                        />
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            disabled={
                                                                loadingItems.includes(item.id) ||
                                                                (isDigitalProduct(item.product) && item.quantity >= 1) ||
                                                                (!isDigitalProduct(item.product) && item.quantity >= item.product.quantity)
                                                            }
                                                            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-gray-200 font-bold py-1 px-2 rounded-r"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        disabled={loadingItems.includes(item.id)}
                                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium disabled:opacity-50"
                                                    >
                                                        {loadingItems.includes(item.id) ? 'Removing...' : 'Remove'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="mt-6">
                            <Link 
                                href="/products" 
                                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                            >
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 sticky top-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Order Summary
                            </h2>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatPrice(cartTotal)}
                                    </span>
                                </div>
                                
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        Calculated at checkout
                                    </span>
                                </div>
                                
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        Calculated at checkout
                                    </span>
                                </div>
                                
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-base font-semibold text-gray-900 dark:text-white">
                                            Total
                                        </span>
                                        <span className="text-xl font-bold text-indigo-600">
                                            {formatPrice(cartTotal)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <button
                                onClick={proceedToCheckout}
                                className="w-full mt-6 bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                            >
                                Proceed to Checkout
                            </button>
                            
                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Secure checkout powered by our payment processor
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}