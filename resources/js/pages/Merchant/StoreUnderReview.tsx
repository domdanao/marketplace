import { Head } from '@inertiajs/react';
import MerchantLayout from '@/Layouts/MerchantLayout';

interface Store {
    id: string;
    name: string;
    description: string;
    status: 'pending' | 'approved' | 'suspended';
    contact_email: string;
    contact_phone?: string;
    address: string;
    created_at: string;
    updated_at: string;
}

interface StoreUnderReviewProps {
    store: Store;
}

export default function StoreUnderReview({ store }: StoreUnderReviewProps) {
    return (
        <MerchantLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Store Under Review</h2>}
        >
            <Head title="Store Under Review" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8 text-center">
                            <div className="mb-6">
                                <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Your Store is Under Review
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Thank you for submitting your store information. Our team is currently reviewing your application.
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Store Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Store Name</label>
                                        <p className="text-gray-900 dark:text-white">{store.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                            Pending Review
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Email</label>
                                        <p className="text-gray-900 dark:text-white">{store.contact_email}</p>
                                    </div>
                                    {store.contact_phone && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Phone</label>
                                            <p className="text-gray-900 dark:text-white">{store.contact_phone}</p>
                                        </div>
                                    )}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                                        <p className="text-gray-900 dark:text-white">{store.address}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                        <p className="text-gray-900 dark:text-white">{store.description}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <div className="text-left">
                                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">What happens next?</h4>
                                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                            Our team will review your store information and get back to you within 24-48 hours. 
                                            You'll receive an email notification once your store is approved.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Submitted on {new Date(store.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MerchantLayout>
    );
}