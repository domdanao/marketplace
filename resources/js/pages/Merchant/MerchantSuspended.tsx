import { Head } from '@inertiajs/react';

interface Merchant {
    business_name: string;
    status: string;
    rejection_reason?: string;
}

interface Props {
    merchant: Merchant;
}

export default function MerchantSuspended({ merchant }: Props) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Merchant Account Suspended" />
            
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                        Account Suspended
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Your merchant account has been temporarily suspended.
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                            {merchant.business_name}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Your merchant account has been suspended. Please contact support to resolve this issue.
                        </p>
                        {merchant.rejection_reason && (
                            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900 rounded-md">
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    <strong>Reason:</strong> {merchant.rejection_reason}
                                </p>
                            </div>
                        )}
                        <div className="mt-6">
                            <button
                                onClick={() => window.history.back()}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}