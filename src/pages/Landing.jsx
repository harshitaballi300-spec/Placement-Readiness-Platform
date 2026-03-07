import { useNavigate } from 'react-router-dom';
import { Code, Video, BarChart } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900">
            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
                <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6">
                    Ace Your Placement
                </h1>
                <p className="max-w-2xl text-xl text-gray-600 mb-10">
                    Practice, assess, and prepare for your dream job with our comprehensive readiness platform.
                </p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 shadow-md cursor-pointer"
                >
                    Get Started
                </button>

                {/* Features Grid */}
                <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-6xl w-full">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                        <div className="bg-indigo-100 p-4 rounded-full mb-6">
                            <Code className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Practice Problems</h3>
                        <p className="text-gray-600">Sharpen your coding skills with industry-standard algorithmic challenges.</p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                        <div className="bg-indigo-100 p-4 rounded-full mb-6">
                            <Video className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Mock Interviews</h3>
                        <p className="text-gray-600">Simulate real technical interviews to build your confidence and communication.</p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                        <div className="bg-indigo-100 p-4 rounded-full mb-6">
                            <BarChart className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Track Progress</h3>
                        <p className="text-gray-600">Monitor your performance analytics and identify areas for improvement.</p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-8 text-center">
                <p className="text-gray-500">&copy; {new Date().getFullYear()} Placement Readiness Platform. All rights reserved.</p>
            </footer>
        </div>
    );
}
