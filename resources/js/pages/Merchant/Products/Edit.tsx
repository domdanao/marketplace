import { Head, Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import { useState } from 'react';
import MerchantLayout from '@/Layouts/MerchantLayout';

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    category_id: string;
    price: number;
    quantity: number;
    digital_product: boolean;
    download_url?: string;
    category: {
        id: string;
        name: string;
    };
}

interface Props {
    product: Product;
    categories: Category[];
}

export default function MerchantProductEdit({ product, categories }: Props) {
    const [isDigital, setIsDigital] = useState(product.digital_product);

    return (
        <MerchantLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Edit Product
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Update product information
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <Link
                            href={`/merchant/products/${product.id}`}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Back to Product
                        </Link>
                        <Link
                            href="/merchant/products"
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            All Products
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Edit ${product.name} - Merchant`} />

            <div className="max-w-2xl">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Edit Product Information
                        </h3>
                    </div>

                    <Form action={`/merchant/products/${product.id}`} method="put" className="p-6">
                        {({
                            errors,
                            hasErrors,
                            processing,
                            wasSuccessful,
                            recentlySuccessful,
                        }) => (
                            <div className="space-y-6">
                                {/* Product Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        defaultValue={product.name}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Enter product name"
                                    />
                                    {errors.name && (
                                        <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>

                                {/* Product Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        rows={4}
                                        defaultValue={product.description}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Describe your product in detail..."
                                    />
                                    {errors.description && (
                                        <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.description}
                                        </div>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Category *
                                    </label>
                                    <select
                                        name="category_id"
                                        defaultValue={product.category_id}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.category_id}
                                        </div>
                                    )}
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Price ($) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        min="0.01"
                                        max="999999.99"
                                        step="0.01"
                                        defaultValue={product.price}
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="0.00"
                                    />
                                    {errors.price && (
                                        <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.price}
                                        </div>
                                    )}
                                </div>

                                {/* Digital Product Toggle */}
                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="digital_product"
                                            value="1"
                                            checked={isDigital}
                                            onChange={(e) => setIsDigital(e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                            This is a digital product
                                        </span>
                                    </label>
                                    {errors.digital_product && (
                                        <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.digital_product}
                                        </div>
                                    )}
                                </div>

                                {/* Conditional Fields Based on Digital Product */}
                                {isDigital ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Download URL *
                                        </label>
                                        <input
                                            type="url"
                                            name="download_url"
                                            defaultValue={product.download_url || ''}
                                            required={isDigital}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="https://example.com/download-link"
                                        />
                                        {errors.download_url && (
                                            <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.download_url}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Quantity *
                                        </label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            min="0"
                                            max="999999"
                                            defaultValue={product.quantity}
                                            required={!isDigital}
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="0"
                                        />
                                        {errors.quantity && (
                                            <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.quantity}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Form Actions */}
                                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={`/merchant/products/${product.id}`}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Updating...' : 'Update Product'}
                                    </button>
                                </div>

                                {/* Success Message */}
                                {wasSuccessful && (
                                    <div className="p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md">
                                        <div className="text-sm text-green-800 dark:text-green-200">
                                            Product updated successfully!
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </Form>
                </div>
            </div>
        </MerchantLayout>
    );
}