import { Head, Link } from '@inertiajs/react';
import { Form } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function CreateMerchant() {
    return (
        <AdminLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            Create Merchant Account
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Create a new merchant account with user profile
                        </p>
                    </div>
                    <Link
                        href="/admin/merchants"
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Back to Merchants
                    </Link>
                </div>
            }
        >
            <Head title="Create Merchant - Admin" />

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-6 py-6">
                    <Form action="/admin/merchants" method="post">
                        {({ errors, processing }) => (
                            <>
                                {/* User Information Section */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                        User Account Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Enter full name"
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Enter email address"
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Password *
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Enter password"
                                            />
                                            {errors.password && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Confirm Password *
                                            </label>
                                            <input
                                                type="password"
                                                name="password_confirmation"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Confirm password"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Business Information Section */}
                                <div className="mb-8 border-t border-gray-200 dark:border-gray-700 pt-8">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                        Business Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Business Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="business_name"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Enter business name"
                                            />
                                            {errors.business_name && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.business_name}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Business Type *
                                            </label>
                                            <select
                                                name="business_type"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option value="">Select business type</option>
                                                <option value="sole_proprietorship">Sole Proprietorship</option>
                                                <option value="partnership">Partnership</option>
                                                <option value="llc">LLC</option>
                                                <option value="corporation">Corporation</option>
                                                <option value="other">Other</option>
                                            </select>
                                            {errors.business_type && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.business_type}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Enter phone number"
                                            />
                                            {errors.phone && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Tax ID (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                name="tax_id"
                                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Enter tax ID"
                                            />
                                            {errors.tax_id && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.tax_id}
                                                </p>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Business Address *
                                            </label>
                                            <textarea
                                                name="business_address"
                                                required
                                                rows={3}
                                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Enter full business address"
                                            />
                                            {errors.business_address && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.business_address}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Banking Information Section */}
                                <div className="mb-8 border-t border-gray-200 dark:border-gray-700 pt-8">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                        Banking Information (Optional)
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Bank Name
                                            </label>
                                            <input
                                                type="text"
                                                name="bank_name"
                                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Enter bank name"
                                            />
                                            {errors.bank_name && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.bank_name}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Account Holder Name
                                            </label>
                                            <input
                                                type="text"
                                                name="account_holder_name"
                                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Enter account holder name"
                                            />
                                            {errors.account_holder_name && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.account_holder_name}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Account Number
                                            </label>
                                            <input
                                                type="text"
                                                name="account_number"
                                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Enter account number"
                                            />
                                            {errors.account_number && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.account_number}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Routing Number
                                            </label>
                                            <input
                                                type="text"
                                                name="routing_number"
                                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                placeholder="Enter routing number"
                                            />
                                            {errors.routing_number && (
                                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                    {errors.routing_number}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Status Section */}
                                <div className="mb-8 border-t border-gray-200 dark:border-gray-700 pt-8">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                        Account Status
                                    </h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Initial Status
                                        </label>
                                        <select
                                            name="status"
                                            defaultValue="pending"
                                            className="mt-1 block w-full md:w-64 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="pending">Pending Review</option>
                                            <option value="approved">Approved</option>
                                            <option value="suspended">Suspended</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            The merchant account will be created with this initial status.
                                        </p>
                                        {errors.status && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.status}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Section */}
                                <div className="flex items-center justify-end space-x-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <Link
                                        href="/admin/merchants"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {processing ? 'Creating Merchant...' : 'Create Merchant Account'}
                                    </button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </AdminLayout>
    );
}