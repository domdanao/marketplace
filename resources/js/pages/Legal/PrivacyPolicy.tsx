import { Head } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';

export default function PrivacyPolicy() {
    return (
        <StorefrontLayout>
            <Head title="Privacy Policy" />
            
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Privacy Policy
                </h1>
                
                <div className="prose prose-gray dark:prose-invert max-w-none">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
                        <p className="text-blue-800 dark:text-blue-200 font-medium">
                            ⚠️ Template Placeholder - This is a placeholder for your Privacy Policy.
                        </p>
                        <p className="text-blue-700 dark:text-blue-300 text-sm mt-2">
                            Replace this content with your actual privacy policy. Ensure compliance with GDPR, CCPA, 
                            and other applicable privacy regulations in your jurisdiction.
                        </p>
                    </div>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
                        <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                        <ul className="list-disc pl-6 space-y-1 mb-4">
                            <li>Name, email address, and contact information</li>
                            <li>Shipping and billing addresses</li>
                            <li>Payment information (processed securely by our payment partners)</li>
                            <li>Account preferences and settings</li>
                        </ul>
                        
                        <h3 className="text-lg font-medium mb-2">Usage Information</h3>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Pages visited and time spent on our platform</li>
                            <li>Search queries and browsing behavior</li>
                            <li>Device and browser information</li>
                            <li>IP address and location data</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>To provide and improve our marketplace services</li>
                            <li>To process transactions and communicate about orders</li>
                            <li>To personalize your experience and show relevant products</li>
                            <li>To send important updates about your account or our services</li>
                            <li>To prevent fraud and ensure platform security</li>
                            <li>To comply with legal obligations</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">3. Information Sharing</h2>
                        <p className="mb-4">
                            We do not sell, trade, or rent your personal information to third parties. We may share 
                            information in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>With sellers to fulfill your orders</li>
                            <li>With payment processors to handle transactions</li>
                            <li>With service providers who help us operate our platform</li>
                            <li>When required by law or to protect our rights</li>
                            <li>In connection with a business transfer or sale</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your personal information, 
                            including encryption, secure servers, and regular security audits.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
                        <p className="mb-4">You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Access and review your personal information</li>
                            <li>Correct inaccurate or incomplete information</li>
                            <li>Delete your account and personal information</li>
                            <li>Object to or restrict certain processing</li>
                            <li>Data portability (where applicable)</li>
                            <li>Withdraw consent for marketing communications</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">6. Cookies and Tracking</h2>
                        <p>
                            We use cookies and similar technologies to improve your experience, analyze usage, 
                            and provide personalized content. You can control cookie settings through your browser.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">7. Contact Us</h2>
                        <p>
                            For questions about this Privacy Policy or to exercise your rights, contact us at:
                            <br />
                            Email: privacy@[yourdomain].com
                            <br />
                            Address: [Your Business Address]
                        </p>
                    </section>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
                        Last updated: [Date]
                    </p>
                </div>
            </div>
        </StorefrontLayout>
    );
}