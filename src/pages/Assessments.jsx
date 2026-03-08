import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { analyzeJD, saveHistory, getHistory } from '../lib/analyzer';
import { Briefcase, Building, FileText, ChevronRight, History } from 'lucide-react';

export default function Assessments() {
    const navigate = useNavigate();
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [jdText, setJdText] = useState('');
    const [history, setHistory] = useState([]);
    const [showCorruptedMsg, setShowCorruptedMsg] = useState(false);

    useEffect(() => {
        const rawHistory = localStorage.getItem("jd_history") || "[]";
        try {
            const parsed = JSON.parse(rawHistory);
            const valid = parsed.filter(e => e && e.id);
            if (valid.length < parsed.length) setShowCorruptedMsg(true);
            setHistory(valid);
        } catch (e) {
            setShowCorruptedMsg(true);
            setHistory([]);
        }
    }, []);

    const handleAnalyze = (e) => {
        e.preventDefault();
        if (!jdText || jdText.length < 1) return;
        const result = analyzeJD(company, role, jdText);
        saveHistory(result);
        navigate(`/results/${result.id}`);
    };

    const isJdTooShort = jdText.length > 0 && jdText.length < 200;

    return (
        <div className="space-y-6 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">JD Analyzer</h1>
                <p className="text-gray-500 mt-1">Paste a job description to extract skills and generate a prep plan.</p>
            </div>

            {showCorruptedMsg && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm flex items-center shadow-sm">
                    <span className="mr-2">⚠️</span>
                    One saved entry couldn't be loaded. Create a new analysis.
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 align-top items-start">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Analyze New Role</CardTitle>
                            <CardDescription>Get personalized checklist, 7-day plan, and potential questions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAnalyze} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name (Optional)</label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={company}
                                                onChange={(e) => setCompany(e.target.value)}
                                                className="w-full bg-white pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary focus:outline-none"
                                                placeholder="e.g. Google"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role Title (Optional)</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                                className="w-full bg-white pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary focus:outline-none"
                                                placeholder="e.g. SDE 1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Description Text *</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <textarea
                                            required
                                            rows="8"
                                            value={jdText}
                                            onChange={(e) => setJdText(e.target.value)}
                                            className={`w-full bg-white pl-10 pr-4 py-2 border rounded-lg focus:ring-primary focus:border-primary focus:outline-none resize-none transition-colors ${isJdTooShort ? 'border-amber-300 bg-amber-50/10' : 'border-gray-300'}`}
                                            placeholder="Paste the full job description here..."
                                        />
                                    </div>
                                    {isJdTooShort && (
                                        <p className="mt-2 text-xs font-medium text-amber-600 flex items-center">
                                            <span className="mr-1.5">ℹ️</span> This JD is too short to analyze deeply. Paste full JD for better output.
                                        </p>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={!jdText}
                                        className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center cursor-pointer shadow-md"
                                    >
                                        Generate Analysis
                                    </button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center"><History className="w-5 h-5 mr-2 text-indigo-600" /> Analysis History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {history.length === 0 ? (
                                <p className="text-gray-500 text-sm italic">No analysis history found. Start by analyzing a job description.</p>
                            ) : (
                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                    {history.map(item => (
                                        <div
                                            key={item.id}
                                            onClick={() => navigate(`/results/${item.id}`)}
                                            className="p-4 border border-gray-100 bg-gray-50 rounded-lg cursor-pointer hover:border-primary hover:bg-indigo-50 transition-all group"
                                        >
                                            <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{item.role || "Untitled Role"}</h4>
                                            <p className="text-sm text-gray-500 mb-2 truncate">{item.company || "Unknown Company"} &bull; {new Date(item.createdAt).toLocaleDateString()}</p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs font-semibold px-2 py-1 bg-white border border-gray-200 rounded text-gray-700">
                                                    Score: {item.finalScore !== undefined ? item.finalScore : item.readinessScore}/100
                                                </span>
                                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
