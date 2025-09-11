import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    images?: string[];
    category: {
        id: string;
        name: string;
    };
}

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Store {
    id: string;
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    banner?: string;
    created_at: string;
}

interface Props {
    store: Store;
    products: PaginatedProducts;
}

export default function StorefrontStoreShow({ store, products }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    return (
        <StorefrontLayout>
            <Head title={`${store.name} - Store`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Store Header */}
                <div className="mb-8">
                    {/* Store Banner */}
                    <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg overflow-hidden">
                        {store.banner && (
                            <img
                                src={store.banner}
                                alt={`${store.name} banner`}
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                        <div className="absolute bottom-4 left-4 flex items-center">
                            {store.logo ? (
                                <img
                                    src={store.logo}
                                    alt={`${store.name} logo`}
                                    className="w-16 h-16 rounded-full object-cover bg-white shadow-lg"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-xl font-bold text-gray-800">
                                        {store.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div className="ml-4 text-white">
                                <h1 className="text-3xl font-bold">{store.name}</h1>
                                <p className="text-lg opacity-90">
                                    Member since {new Date(store.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Store Description */}
                    {store.description && (
                        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                About {store.name}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                {store.description}
                            </p>
                        </div>
                    )}
                </div>

                {/* Products Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Products ({products.total})
                        </h2>
                        <Link
                            href="/stores"
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            ← Browse All Stores
                        </Link>
                    </div>

                    {products.data.length > 0 ? (
                        <>
                            {/* Products Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                {products.data.map((product) => (
                                    <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                                        <div className="aspect-square bg-gray-200 dark:bg-gray-700">
                                            {product.images && product.images.length > 0 ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-gray-400">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                {product.category.name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                                                {product.description}
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                                    {formatCurrency(product.price)}
                                                </span>
                                                <Link
                                                    href={`/products/${product.slug}`}
                                                    className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {products.last_page > 1 && (
                                <div className="flex justify-center">
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        {products.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`relative inline-flex items-center px-2 py-2 border text-sm font-medium ${
                                                    link.active
                                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                } ${!link.url && 'cursor-not-allowed opacity-50'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                                📦
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No products yet
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                This store hasn't added any products yet.
                            </p>
                            <Link
                                href="/"
                                className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                Browse other products →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </StorefrontLayout>
    );
}