import { Head, Link } from '@inertiajs/react';
import { TestTube, Book, Clock, Users, Shield, Cog } from 'lucide-react';

interface MarkdownFile {
    title: string;
    description: string;
    icon: string;
    color: string;
}

interface Props {
    files: Record<string, MarkdownFile>;
}

const iconMap = {
    'test-tube': TestTube,
    'book': Book,
    'clock': Clock,
    'users': Users,
    'shield': Shield,
    'cog': Cog,
};

const colorMap = {
    'blue': 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
    'green': 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
    'purple': 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400',
    'orange': 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400',
    'gray': 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400',
    'indigo': 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400',
};

export default function Index({ files }: Props) {
    return (
        <>
            <Head title="Documentation" />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                                <Book className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Documentation
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Browse and view markdown documentation files for the marketplace application.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="mb-8">
                        <nav className="flex items-center space-x-2 text-sm text-gray-500">
                            <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">
                                Home
                            </Link>
                            <span>→</span>
                            <span className="text-gray-900 dark:text-white">Documentation</span>
                        </nav>
                    </div>

                    {/* Files Grid */}
                    {Object.keys(files).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(files).map(([filename, file]) => {
                                const IconComponent = iconMap[file.icon as keyof typeof iconMap] || Book;
                                const colorClasses = colorMap[file.color as keyof typeof colorMap] || colorMap.gray;

                                return (
                                    <Link
                                        key={filename}
                                        href={`/docs/${filename}`}
                                        className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center mb-4">
                                                <div className={`p-2 rounded-lg ${colorClasses}`}>
                                                    <IconComponent className="w-5 h-5" />
                                                </div>
                                                <div className="ml-3 flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {file.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {filename}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                                {file.description}
                                            </p>
                                        </div>
                                        <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-lg">
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <span>View document</span>
                                                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Book className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No documentation files found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                There are no markdown files available to view at this time.
                            </p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-12 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Documentation files are served securely from the project root directory.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}