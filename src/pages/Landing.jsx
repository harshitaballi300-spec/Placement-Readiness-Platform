import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Video, BarChart, Building, Briefcase, FileText, Sparkles } from 'lucide-react';
import { analyzeJD, saveHistory } from '../lib/analyzer';

export default function Landing() {
    const navigate = useNavigate();
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [jdText, setJdText] = useState('');

    const handleAnalyze = (e) => {
        e.preventDefault();
        if (!jdText || jdText.length < 1) return;
        const result = analyzeJD(company, role, jdText);
        saveHistory(result);
        navigate(`/results/${result.id}`);
    };

    const isJdTooShort = jdText.length > 0 && jdText.length < 200;

    return (
        <div className="min-h-screen flex flex-col font-sans bg-white text-gray-900 selection:bg-indigo-100">
            {/* Hero Section */}
            <main className="flex-1">
                <div className="relative overflow-hidden bg-gray-50 pt-16 pb-24 sm:pt-24 sm:pb-32">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10 mb-8 bg-indigo-50">
                            <Sparkles className="w-4 h-4 mr-2" /> Elevate your career with AI
                        </div>
                        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl mb-8 leading-tight">
                            Ace Your Placement <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">With Strategic Prep</span>
                        </h1>
                        <p className="mx-auto max-w-2xl text-xl text-gray-600 mb-12 leading-relaxed">
                            Stop guessing. Paste your dream job description and get a customized 7-day preparation roadmap instantly.
                        </p>

                        {/* Analysis Card on Home */}
                        <div className="mx-auto max-w-3xl bg-white rounded-3xl shadow-2xl shadow-indigo-200/50 border border-gray-100 overflow-hidden text-left transform hover:scale-[1.01] transition-transform duration-500">
                            <div className="p-8 sm:p-10">
                                <form onSubmit={handleAnalyze} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Company</label>
                                            <div className="relative group">
                                                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                                <input
                                                    type="text"
                                                    value={company}
                                                    onChange={(e) => setCompany(e.target.value)}
                                                    className="w-full bg-gray-50/50 pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none focus:bg-white transition-all text-sm"
                                                    placeholder="e.g. Google"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Role Title</label>
                                            <div className="relative group">
                                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                                <input
                                                    type="text"
                                                    value={role}
                                                    onChange={(e) => setRole(e.target.value)}
                                                    className="w-full bg-gray-50/50 pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none focus:bg-white transition-all text-sm"
                                                    placeholder="e.g. Frontend Engineer"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Job Description *</label>
                                        <div className="relative group">
                                            <FileText className="absolute left-4 top-5 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                            <textarea
                                                required
                                                rows="6"
                                                value={jdText}
                                                onChange={(e) => setJdText(e.target.value)}
                                                className={`w-full bg-gray-50/50 pl-12 pr-4 py-4 border rounded-3xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none focus:bg-white transition-all text-sm resize-none ${isJdTooShort ? 'border-amber-300' : 'border-gray-200'}`}
                                                placeholder="Paste the full job description here to analyze required skills..."
                                            />
                                        </div>
                                        {isJdTooShort && (
                                            <div className="px-4 py-3 bg-amber-50 text-amber-700 rounded-2xl text-xs font-medium border border-amber-100 flex items-center shadow-sm animate-in fade-in slide-in-from-top-2">
                                                <span className="mr-2">💡</span>
                                                This JD is too short to analyze deeply. Paste full JD for better output.
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={!jdText}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center text-lg active:scale-[0.98] cursor-pointer"
                                        >
                                            Generate Your Roadmap <ArrowRight className="w-5 h-5 ml-2" />
                                        </button>
                                        <p className="mt-4 text-center text-xs text-gray-400">
                                            No signup required. All analysis happens locally.
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="py-24 sm:py-32 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 max-w-6xl mx-auto w-full">
                            <div className="flex flex-col items-center text-center group">
                                <div className="bg-indigo-50 p-6 rounded-3xl mb-8 group-hover:bg-indigo-600 transition-colors duration-500">
                                    <Code className="w-10 h-10 text-indigo-600 group-hover:text-white transition-colors duration-500" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-900">Skill Extraction</h3>
                                <p className="text-gray-500 leading-relaxed">Our AI identifies core CS, language, and tool requirements from any technical JD.</p>
                            </div>

                            <div className="flex flex-col items-center text-center group">
                                <div className="bg-purple-50 p-6 rounded-3xl mb-8 group-hover:bg-purple-600 transition-colors duration-500">
                                    <Video className="w-10 h-10 text-purple-600 group-hover:text-white transition-colors duration-500" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-900">Round Mapping</h3>
                                <p className="text-gray-500 leading-relaxed">Predictive round mapping for both product-based giants and agile startups.</p>
                            </div>

                            <div className="flex flex-col items-center text-center group">
                                <div className="bg-emerald-50 p-6 rounded-3xl mb-8 group-hover:bg-emerald-600 transition-colors duration-500">
                                    <BarChart className="w-10 h-10 text-emerald-600 group-hover:text-white transition-colors duration-500" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-900">Readiness Score</h3>
                                <p className="text-gray-500 leading-relaxed">Live scoring that updates as you master each required skill in your prep plan.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-100 py-12 text-center">
                <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Placement Readiness Platform. Professional Prep Guaranteed.</p>
            </footer>
        </div>
    );
}

import { ArrowRight } from 'lucide-react';
