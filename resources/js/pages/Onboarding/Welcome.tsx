import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function OnboardingWelcome() {
    return (
        <AppLayout>
            <Head title="Welcome to the Platform" />
            
            <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Welcome to [Your Marketplace]! 🎉
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Let's get you set up and ready to start exploring.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                        <p className="text-green-800 dark:text-green-200 font-medium">
                            ⚠️ Template Placeholder - User Onboarding Flow
                        </p>
                        <p className="text-green-700 dark:text-green-300 text-sm mt-2">
                            This is a placeholder for your user onboarding experience. Customize this flow 
                            based on your marketplace's specific needs and user journey.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                                    <span className="text-indigo-600 dark:text-indigo-300 font-medium">1</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Complete Your Profile
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Add your preferences and interests to get personalized recommendations.
                                </p>
                                <Link 
                                    href="/settings/profile" 
                                    className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                                >
                                    Complete Profile →
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                                    <span className="text-indigo-600 dark:text-indigo-300 font-medium">2</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Explore Products
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Browse our marketplace and discover amazing products from verified sellers.
                                </p>
                                <Link 
                                    href="/products" 
                                    className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                                >
                                    Browse Products →
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                                    <span className="text-indigo-600 dark:text-indigo-300 font-medium">3</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Start Selling (Optional)
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Have something to sell? Join our community of merchants and start earning.
                                </p>
                                <Link 
                                    href="/merchant/store/create" 
                                    className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                                >
                                    Become a Seller →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <Link 
                        href="/dashboard" 
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Continue to Dashboard
                    </Link>
                    
                    <div>
                        <Link 
                            href="/" 
                            className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
                        >
                            Skip onboarding and go to homepage
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}