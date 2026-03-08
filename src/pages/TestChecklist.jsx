import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { CheckCircle2, Circle, AlertCircle, RefreshCw, Info, Ship } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TEST_ITEMS = [
    { id: 'validation', label: 'JD required validation works', hint: 'Try submitting the analyzer form with an empty JD field.' },
    { id: 'warning', label: 'Short JD warning shows for <200 chars', hint: 'Paste a few words in the JD box and check if the amber warning appears.' },
    { id: 'extraction', label: 'Skills extraction groups correctly', hint: 'Paste a JD with "React", "Java", and "SQL" to see if they appear in Web, Languages, and Data.' },
    { id: 'mapping', label: 'Round mapping changes based on company + skills', hint: 'Compare "Google" (Enterprise) with "Small Startup" (Startup) mapping.' },
    { id: 'score_det', label: 'Score calculation is deterministic', hint: 'Check if pasting the same JD always gives the same base score.' },
    { id: 'toggle_live', label: 'Skill toggles update score live', hint: 'On the results page, toggle a skill and watch the readiness score change immediately.' },
    { id: 'persistence', label: 'Changes persist after refresh', hint: 'Set a skill to "Mastered", refresh the results page, and verify it stays Mastered.' },
    { id: 'history', label: 'History saves and loads correctly', hint: 'Create an analysis, go back to /assessments, and check the History sidebar.' },
    { id: 'export', label: 'Export buttons copy the correct content', hint: 'Click "Copy Questions" and paste into notepad to verify content.' },
    { id: 'no_errors', label: 'No console errors on core pages', hint: 'Open F12 DevTools and browse Dashboard, Analyzer, and Results.' }
];

export default function TestChecklist() {
    const navigate = useNavigate();
    const [checklist, setChecklist] = useState(() => {
        const saved = localStorage.getItem('prp_test_checklist');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('prp_test_checklist', JSON.stringify(checklist));
    }, [checklist]);

    const toggleItem = (id) => {
        setChecklist(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const resetChecklist = () => {
        if (window.confirm('Are you sure you want to reset all test progress?')) {
            setChecklist({});
        }
    };

    const passedCount = Object.values(checklist).filter(Boolean).length;
    const isReady = passedCount === 10;

    return (
        <div className="space-y-6 pb-12">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">QA & Test Checklist</h1>
                    <p className="text-gray-500 mt-1">Verify all core features before shipping the platform.</p>
                </div>
                <button
                    onClick={resetChecklist}
                    className="flex items-center text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
                >
                    <RefreshCw className="w-4 h-4 mr-2" /> Reset checklist
                </button>
            </div>

            {/* Summary Header */}
            <div className={`p-6 rounded-2xl border transition-all ${isReady ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className={`p-3 rounded-full mr-4 ${isReady ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                            {isReady ? <Ship className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Tests Passed: {passedCount} / 10</h2>
                            <p className={`text-sm font-medium ${isReady ? 'text-emerald-700' : 'text-amber-700'}`}>
                                {isReady ? 'All systems go. The platform is ready for shipping.' : 'Fix issues before shipping. All tests must pass to unlock /prp/08-ship.'}
                            </p>
                        </div>
                    </div>
                    {isReady && (
                        <button
                            onClick={() => navigate('/prp/08-ship')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center"
                        >
                            Proceed to Shipping <Ship className="w-5 h-5 ml-2" />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {TEST_ITEMS.map((item) => (
                    <Card key={item.id} className={`transition-all ${checklist[item.id] ? 'border-emerald-100 bg-emerald-50/20' : 'border-gray-200'}`}>
                        <CardContent className="p-5">
                            <div className="flex items-start">
                                <button
                                    onClick={() => toggleItem(item.id)}
                                    className="mt-0.5 mr-4 focus:outline-none"
                                >
                                    {checklist[item.id] ? (
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50" />
                                    ) : (
                                        <Circle className="w-6 h-6 text-gray-300" />
                                    )}
                                </button>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className={`font-bold transition-colors ${checklist[item.id] ? 'text-emerald-900' : 'text-gray-800'}`}>
                                            {item.label}
                                        </h3>
                                        <div className="group relative">
                                            <Info className="w-4 h-4 text-gray-300 cursor-help" />
                                            <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-[11px] rounded-xl shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all pointer-events-none z-50 leading-relaxed font-medium">
                                                <p className="border-b border-white/10 pb-1.5 mb-1.5 text-indigo-300 uppercase tracking-widest text-[9px] font-bold">How to test</p>
                                                {item.hint}
                                            </div>
                                        </div>
                                    </div>
                                    <p className={`text-xs mt-1 font-medium ${checklist[item.id] ? 'text-emerald-600' : 'text-gray-400'}`}>
                                        {checklist[item.id] ? 'Verified and active.' : 'Pending verification.'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
