import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';

interface Product {
    id: string;
    name: string;
    price: number;
    images?: string[];
    description: string;
    store: {
        id: string;
        name: string;
    };
    category: {
        id: string;
        name: string;
        slug: string;
    };
}

interface Category {
    id: string;
    name: string;
    slug: string;
    products_count: number;
}

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    products: PaginatedProducts;
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
        price_min?: number;
        price_max?: number;
        digital_only?: boolean;
        sort?: string;
    };
}

export default function StorefrontProductsIndex({ products, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [priceMin, setPriceMin] = useState(filters.price_min || '');
    const [priceMax, setPriceMax] = useState(filters.price_max || '');
    const [digitalOnly, setDigitalOnly] = useState(filters.digital_only || false);
    const [sort, setSort] = useState(filters.sort || 'newest');

    const handleFilter = () => {
        router.get('/', {
            search: search || undefined,
            category: selectedCategory || undefined,
            price_min: priceMin || undefined,
            price_max: priceMax || undefined,
            digital_only: digitalOnly || undefined,
            sort: sort !== 'newest' ? sort : undefined,
        });
    };

    const handleReset = () => {
        setSearch('');
        setSelectedCategory('');
        setPriceMin('');
        setPriceMax('');
        setDigitalOnly(false);
        setSort('newest');
        router.get('/');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <StorefrontLayout>
            <Head title="Products - Marketplace" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Browse Products
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Discover amazing products from our marketplace
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Filters
                            </h2>

                            {/* Search */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                />
                            </div>

                            {/* Category */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.slug}>
                                            {category.name} ({category.products_count})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Price Range
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        value={priceMin}
                                        onChange={(e) => setPriceMin(e.target.value)}
                                        placeholder="Min"
                                        className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <input
                                        type="number"
                                        value={priceMax}
                                        onChange={(e) => setPriceMax(e.target.value)}
                                        placeholder="Max"
                                        className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* Digital Only */}
                            <div className="mb-6">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={digitalOnly}
                                        onChange={(e) => setDigitalOnly(e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                        Digital products only
                                    </span>
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-2">
                                <button
                                    onClick={handleFilter}
                                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Apply Filters
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="w-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {/* Sort Options */}
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Showing {products.data.length} of {products.total} products
                            </p>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                onBlur={handleFilter}
                                className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="newest">Newest</option>
                                <option value="name">Name A-Z</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>

                        {/* Products Grid */}
                        {products.data.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                                                by {product.store.name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                                                {product.description}
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                                    {formatCurrency(product.price)}
                                                </span>
                                                <Link
                                                    href={`/products/${product.id}`}
                                                    className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400 text-lg">
                                    No products found matching your criteria.
                                </p>
                                <button
                                    onClick={handleReset}
                                    className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {products.last_page > 1 && (
                            <div className="mt-8 flex justify-center">
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
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}