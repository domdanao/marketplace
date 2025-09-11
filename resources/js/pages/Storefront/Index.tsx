import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    store: {
        name: string;
        slug: string;
    };
}

interface Store {
    id: string;
    name: string;
    slug: string;
    description: string;
    logo?: string;
    products_count: number;
}

interface Category {
    id: string;
    name: string;
    slug: string;
    products_count: number;
}

interface Props {
    featuredProducts: Product[];
    popularStores: Store[];
    categories: Category[];
    stats: {
        totalProducts: number;
        totalStores: number;
        totalCategories: number;
    };
}

export default function StorefrontIndex({ featuredProducts, popularStores, categories, stats }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(price);
    };

    return (
        <StorefrontLayout>
            <Head title="Marketplace - Shop Everything You Need" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Welcome to Our Marketplace
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            Discover amazing products from local merchants. Shop with confidence and support small businesses.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link 
                                href="/products" 
                                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Browse Products
                            </Link>
                            <Link 
                                href="/stores" 
                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
                            >
                                Explore Stores
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-indigo-600 mb-2">
                                {stats.totalProducts.toLocaleString()}+
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">Products Available</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-indigo-600 mb-2">
                                {stats.totalStores.toLocaleString()}+
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">Trusted Merchants</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-indigo-600 mb-2">
                                {stats.totalCategories.toLocaleString()}+
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">Categories</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Featured Products
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Discover our most popular and trending items
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <div key={product.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <Link href={`/products/${product.slug}`}>
                                    <div className="aspect-w-1 aspect-h-1">
                                        <img 
                                            src={product.images[0] || '/placeholder-product.svg'} 
                                            alt={product.name}
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                            by {product.store.name}
                                        </p>
                                        <p className="text-xl font-bold text-indigo-600">
                                            {formatPrice(product.price)}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                    
                    <div className="text-center mt-8">
                        <Link 
                            href="/products" 
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                        >
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Shop by Category
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Find exactly what you're looking for
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {categories.map((category) => (
                            <Link 
                                key={category.id}
                                href={`/products?category=${category.slug}`}
                                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
                            >
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {category.products_count} products
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Stores */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Popular Stores
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Shop from our top-rated merchants
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {popularStores.map((store) => (
                            <Link 
                                key={store.id} 
                                href={`/stores/${store.slug}`}
                                className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        {store.logo ? (
                                            <img 
                                                src={store.logo} 
                                                alt={store.name} 
                                                className="w-12 h-12 rounded-full mr-4"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full mr-4 flex items-center justify-center">
                                                <span className="text-xl">🏪</span>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {store.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {store.products_count} products
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                                        {store.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    
                    <div className="text-center mt-8">
                        <Link 
                            href="/stores" 
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                        >
                            View All Stores
                        </Link>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-indigo-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Start Selling?
                    </h2>
                    <p className="text-xl text-indigo-200 mb-8">
                        Join thousands of merchants already selling on our platform
                    </p>
                    <Link 
                        href="/register?role=merchant" 
                        className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Become a Merchant
                    </Link>
                </div>
            </section>
        </StorefrontLayout>
    );
}