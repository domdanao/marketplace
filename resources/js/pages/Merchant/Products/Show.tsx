import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import MerchantLayout from '@/Layouts/MerchantLayout';

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    quantity: number;
    digital_product: boolean;
    download_url?: string;
    status: 'draft' | 'published' | 'archived';
    images?: string[];
    category: {
        id: string;
        name: string;
    };
    store: {
        id: string;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

interface Props {
    product: Product;
}

export default function MerchantProductShow({ product }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
            published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            archived: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const handlePublish = () => {
        router.post(`/merchant/products/${product.id}/publish`);
    };

    const handleUnpublish = () => {
        router.post(`/merchant/products/${product.id}/unpublish`);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/merchant/products/${product.id}`);
        }
    };

    return (
        <MerchantLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            {product.name}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Product Details
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <Link
                            href="/merchant/products"
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Back to Products
                        </Link>
                        <Link
                            href={`/merchant/products/${product.id}/edit`}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Edit
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`${product.name} - Merchant`} />

            <div className="space-y-6">
                {/* Product Header */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-4">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {product.name}
                                </h1>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(product.status)}`}>
                                    {product.status}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div>
                                    <strong>Category:</strong> {product.category.name}
                                </div>
                                <div>
                                    <strong>Price:</strong> {formatCurrency(product.price)}
                                </div>
                                <div>
                                    <strong>Type:</strong> {product.digital_product ? 'Digital' : 'Physical'}
                                </div>
                                {!product.digital_product && (
                                    <div>
                                        <strong>Quantity:</strong> {product.quantity}
                                    </div>
                                )}
                                <div>
                                    <strong>Created:</strong> {new Date(product.created_at).toLocaleDateString()}
                                </div>
                                <div>
                                    <strong>Updated:</strong> {new Date(product.updated_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        {/* Product Image */}
                        <div className="ml-6">
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-32 h-32 object-cover rounded-lg shadow"
                                />
                            ) : (
                                <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">No Image</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Product Description */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Description
                    </h3>
                    <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-400">
                        {product.description || 'No description provided.'}
                    </div>
                </div>

                {/* Digital Product Details */}
                {product.digital_product && product.download_url && (
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            Digital Product Details
                        </h3>
                        <div className="space-y-2">
                            <div className="text-sm">
                                <strong className="text-gray-900 dark:text-white">Download URL:</strong>
                                <div className="mt-1">
                                    <a
                                        href={product.download_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:text-indigo-800 break-all"
                                    >
                                        {product.download_url}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Actions
                    </h3>
                    <div className="flex space-x-4">
                        {product.status === 'draft' && (
                            <button
                                onClick={handlePublish}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                Publish Product
                            </button>
                        )}
                        
                        {product.status === 'published' && (
                            <button
                                onClick={handleUnpublish}
                                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                            >
                                Unpublish Product
                            </button>
                        )}

                        <Link
                            href={`/merchant/products/${product.id}/edit`}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Edit Product
                        </Link>

                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Delete Product
                        </button>
                    </div>
                </div>
            </div>
        </MerchantLayout>
    );
}