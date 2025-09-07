import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Home } from 'lucide-react';
import MarkdownViewer from '../../components/MarkdownViewer';

interface Props {
    content: string;
    filename: string;
    title: string;
}

export default function Show({ content, filename, title }: Props) {
    return (
        <>
            <Head title={title} />

            <div className="min-h-screen bg-white dark:bg-gray-950">
                {/* Navigation Header */}
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Breadcrumb */}
                            <nav className="flex items-center space-x-4">
                                <Link
                                    href="/docs"
                                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Back to Documentation</span>
                                </Link>
                                <span className="text-gray-400">|</span>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">
                                        <Home className="w-4 h-4" />
                                    </Link>
                                    <span>→</span>
                                    <Link href="/docs" className="hover:text-gray-700 dark:hover:text-gray-300">
                                        Documentation
                                    </Link>
                                    <span>→</span>
                                    <span className="text-gray-900 dark:text-white">{title}</span>
                                </div>
                            </nav>

                            {/* Actions */}
                            <div className="flex items-center space-x-3">
                                <a
                                    href={`/docs/${filename}?raw=true`}
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Raw
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <MarkdownViewer 
                            content={content} 
                            fileName={filename}
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-6">
                            <Link
                                href="/docs"
                                className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to all documentation</span>
                            </Link>

                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                <span>File: {filename}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}