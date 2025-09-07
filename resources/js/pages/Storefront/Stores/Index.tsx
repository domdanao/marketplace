import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';

interface Store {
    id: string;
    name: string;
    slug: string;
    description: string;
    logo?: string;
    banner?: string;
    products_count: number;
    created_at: string;
}

interface PaginatedStores {
    data: Store[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    stores: PaginatedStores;
    filters: {
        search?: string;
    };
}

export default function StorefrontStoresIndex({ stores, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleFilter = () => {
        router.get('/stores', {
            search: search || undefined,
        });
    };

    const handleReset = () => {
        setSearch('');
        router.get('/stores');
    };

    return (
        <StorefrontLayout>
            <Head title="Stores - Marketplace" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Browse Stores
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Discover amazing stores in our marketplace
                    </p>
                </div>

                {/* Search */}
                <div className="mb-8">
                    <div className="max-w-md">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Search Stores
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search stores..."
                                className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                            />
                            <button
                                onClick={handleFilter}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Search
                            </button>
                            {search && (
                                <button
                                    onClick={handleReset}
                                    className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stores Grid */}
                {stores.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stores.data.map((store) => (
                            <div key={store.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                                {/* Store Banner */}
                                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600">
                                    {store.banner && (
                                        <img
                                            src={store.banner}
                                            alt={`${store.name} banner`}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                
                                {/* Store Info */}
                                <div className="p-6">
                                    {/* Store Logo */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center">
                                            {store.logo ? (
                                                <img
                                                    src={store.logo}
                                                    alt={`${store.name} logo`}
                                                    className="w-12 h-12 rounded-full object-cover bg-white shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                                    <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                                                        {store.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="ml-3">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {store.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {store.products_count} {store.products_count === 1 ? 'product' : 'products'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Store Description */}
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                                        {store.description || 'No description available.'}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Joined {new Date(store.created_at).toLocaleDateString()}
                                        </span>
                                        <Link
                                            href={`/stores/${store.slug}`}
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Visit Store
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                            🏪
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No stores found</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {search ? 'Try adjusting your search criteria.' : 'No stores are currently available.'}
                        </p>
                        {search && (
                            <button
                                onClick={handleReset}
                                className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {stores.last_page > 1 && (
                    <div className="mt-8 flex justify-center">
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            {stores.links.map((link, index) => (
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
            </div>
        </StorefrontLayout>
    );
}