import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    quantity: number;
    images: string[];
    status: string;
    digital_files?: string[];
    metadata?: any;
    store: {
        id: string;
        name: string;
        slug: string;
        description: string;
        logo?: string;
    };
    category: {
        name: string;
        slug: string;
    };
    created_at: string;
}

interface Props {
    product: Product;
    relatedProducts: Product[];
    auth?: {
        user: any;
    };
}

export default function ProductShow({ product, relatedProducts, auth }: Props) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(price);
    };

    const handleAddToCart = () => {
        if (!auth?.user) {
            router.visit('/login');
            return;
        }

        setLoading(true);
        router.post(`/cart/add/${product.id}`, {
            quantity: quantity,
        }, {
            onFinish: () => setLoading(false),
            onSuccess: () => {
                // Refresh page to update cart count in shared props
                router.visit(window.location.pathname, { 
                    preserveScroll: true,
                    preserveState: false 
                });
            },
        });
    };

    const isDigitalProduct = product.digital_files && product.digital_files.length > 0;
    const isOutOfStock = !isDigitalProduct && product.quantity <= 0;

    return (
        <StorefrontLayout>
            <Head title={`${product.name} - Marketplace`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex mb-8" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-4">
                        <li>
                            <Link href="/" className="text-gray-400 hover:text-gray-500">
                                Home
                            </Link>
                        </li>
                        <li>
                            <svg className="flex-shrink-0 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path d="m5.555 17.776 4-16 .894.448-4 16-.894-.448z" />
                            </svg>
                            <Link href="/products" className="ml-4 text-gray-400 hover:text-gray-500">
                                Products
                            </Link>
                        </li>
                        <li>
                            <svg className="flex-shrink-0 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path d="m5.555 17.776 4-16 .894.448-4 16-.894-.448z" />
                            </svg>
                            <span className="ml-4 text-gray-500">{product.name}</span>
                        </li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div>
                        <div className="aspect-w-1 aspect-h-1 mb-4">
                            <img 
                                src={product.images[selectedImage] || '/placeholder-product.svg'} 
                                alt={product.name}
                                className="w-full h-96 object-cover rounded-lg"
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="flex space-x-2 overflow-x-auto">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden ${
                                            selectedImage === index ? 'ring-2 ring-indigo-500' : 'ring-1 ring-gray-200'
                                        }`}
                                    >
                                        <img 
                                            src={image} 
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            {product.name}
                        </h1>
                        
                        <div className="flex items-center mb-4">
                            <span className="text-3xl font-bold text-indigo-600 mr-4">
                                {formatPrice(product.price)}
                            </span>
                            {isDigitalProduct && (
                                <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                    Digital Product
                                </span>
                            )}
                        </div>

                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Description</h3>
                            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>

                        <div className="mb-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                {product.category.name}
                            </span>
                        </div>

                        {/* Stock Status */}
                        <div className="mb-6">
                            {isDigitalProduct ? (
                                <p className="text-green-600 font-medium">✓ Available for instant download</p>
                            ) : isOutOfStock ? (
                                <p className="text-red-600 font-medium">✗ Out of stock</p>
                            ) : (
                                <p className="text-green-600 font-medium">
                                    ✓ In stock ({product.quantity} available)
                                </p>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        {!isOutOfStock && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Quantity
                                </label>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-3 rounded-l"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max={isDigitalProduct ? 1 : product.quantity}
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                        className="bg-gray-50 dark:bg-gray-700 border-t border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-center py-2 px-4 w-20"
                                    />
                                    <button
                                        onClick={() => setQuantity(Math.min(isDigitalProduct ? 1 : product.quantity, quantity + 1))}
                                        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-3 rounded-r"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Add to Cart Button */}
                        <div className="mb-8">
                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock || loading}
                                className={`w-full py-3 px-4 rounded-md font-medium text-white ${
                                    isOutOfStock 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                                } ${loading && 'opacity-50 cursor-not-allowed'}`}
                            >
                                {loading ? 'Adding to Cart...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        </div>

                        {/* Store Info */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Sold by
                            </h3>
                            <Link 
                                href={`/stores/${product.store.slug}`}
                                className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                {product.store.logo ? (
                                    <img 
                                        src={product.store.logo} 
                                        alt={product.store.name} 
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full mr-4 flex items-center justify-center">
                                        <span className="text-xl">🏪</span>
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        {product.store.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                        {product.store.description}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                            Related Products
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((relatedProduct) => (
                                <div key={relatedProduct.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                    <Link href={`/products/${relatedProduct.slug}`}>
                                        <div className="aspect-w-1 aspect-h-1">
                                            <img 
                                                src={relatedProduct.images[0] || '/placeholder-product.svg'} 
                                                alt={relatedProduct.name}
                                                className="w-full h-48 object-cover"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                                {relatedProduct.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                by {relatedProduct.store.name}
                                            </p>
                                            <p className="text-xl font-bold text-indigo-600">
                                                {formatPrice(relatedProduct.price)}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}