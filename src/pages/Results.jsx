import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { getHistoryEntry, updateHistoryEntry } from '../lib/analyzer';
import {
    ArrowLeft, CheckCircle2, ListChecks, Calendar, MessageSquare,
    Target, Download, Copy, CheckCircle, Circle, ArrowRight
} from 'lucide-react';

export default function Results() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [copied, setCopied] = useState(null);

    useEffect(() => {
        const entry = getHistoryEntry(id);
        if (entry) {
            setData(entry);
        }
    }, [id]);

    if (!data) return <div className="p-8 text-gray-600 font-medium">Loading analysis...</div>;

    const handleToggleSkill = (skill) => {
        const currentMap = data.skillConfidenceMap || {};
        const currentStatus = currentMap[skill] || 'practice';
        const newStatus = currentStatus === 'know' ? 'practice' : 'know';

        const updatedMap = { ...currentMap, [skill]: newStatus };

        // Calculate finalScore based on baseScore + mastered skills bonus
        const masteredCount = Object.values(updatedMap).filter(status => status === 'know').length;

        // Rule: baseScore is static, finalScore increases based on skillConfidenceMap
        const newFinalScore = Math.min(100, (data.baseScore || 0) + (masteredCount * 2));

        const updatedData = {
            ...data,
            skillConfidenceMap: updatedMap,
            finalScore: newFinalScore,
            updatedAt: new Date().toISOString()
        };

        setData(updatedData);
        updateHistoryEntry(updatedData);
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const downloadTxt = () => {
        const plan = data.plan7Days || data.plan || [];
        const content = `
ANALYSIS FOR: ${data.role} at ${data.company}
FINAL READINESS SCORE: ${data.finalScore || data.readinessScore}/100
DATE: ${new Date(data.createdAt).toLocaleDateString()}

7-DAY PREP PLAN:
${plan.map(p => `${p.day}: ${p.focus || p.task}`).join('\n')}

CHECKLIST:
${(data.checklist || []).map(r => `\n${r.roundTitle || r.round}:\n${(r.items || []).map(i => `- ${i}`).join('\n')}`).join('\n')}

10 LIKELY INTERVIEW QUESTIONS:
${(data.questions || []).map((q, i) => `${i + 1}. ${q}`).join('\n')}
    `;
        const element = document.createElement("a");
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Prep_Plan_${data.company || 'Job'}.txt`;
        document.body.appendChild(element);
        element.click();
    };

    const skillLabelMap = {
        coreCS: "Core CS",
        languages: "Languages",
        web: "Web",
        data: "Data",
        cloud: "Cloud",
        testing: "Testing",
        other: "Other"
    };

    const extractedSkills = data.extractedSkills || {};
    const confidenceMap = data.skillConfidenceMap || {};
    const allSkills = Object.values(extractedSkills).flat();
    const weakSkills = allSkills
        .filter(s => (confidenceMap[s] || 'practice') === 'practice')
        .slice(0, 3);

    const plan = data.plan7Days || data.plan || [];
    const checklist = data.checklist || [];
    const roundMapping = data.roundMapping || [];

    return (
        <div className="space-y-6 pb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <button onClick={() => navigate('/assessments')} className="flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors cursor-pointer">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Analyzer
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-gray-900">{data.role} Analysis</h1>
                        <span className="text-[10px] uppercase font-bold tracking-widest bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded">Analysis Active</span>
                    </div>
                    <p className="text-gray-500 mt-1">
                        {data.company} • Readiness: <span className="font-bold text-indigo-600 transition-all duration-300">{data.finalScore || data.readinessScore}/100</span>
                        {data.updatedAt && <span className="ml-3 text-[10px] text-gray-400">Updated: {new Date(data.updatedAt).toLocaleTimeString()}</span>}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={downloadTxt}
                        className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black transition-colors shadow-sm cursor-pointer"
                    >
                        <Download className="w-4 h-4 mr-2" /> Download TXT
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* Left Column: Stats & Skills */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg flex items-center"><Target className="w-5 h-5 mr-2 text-indigo-600" /> Skill Confidence</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-gray-500 italic mb-2">Mastering skills increases your readiness score.</p>
                            {Object.entries(extractedSkills).map(([cat, skills]) => skills.length > 0 && (
                                <div key={cat} className="space-y-2">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{skillLabelMap[cat] || cat}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map(s => {
                                            const isKnow = confidenceMap[s] === 'know';
                                            return (
                                                <button
                                                    key={s}
                                                    onClick={() => handleToggleSkill(s)}
                                                    className={`group relative flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${isKnow
                                                        ? 'bg-green-50 text-green-700 border-green-200 shadow-sm'
                                                        : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                                                        }`}
                                                >
                                                    {isKnow ? <CheckCircle className="w-3 h-3 mr-1.5" /> : <Circle className="w-3 h-3 mr-1.5 text-gray-300 group-hover:text-indigo-400" />}
                                                    {s}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card id="roadmap" className="scroll-mt-6">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 text-gray-900">
                            <CardTitle className="text-lg flex items-center"><Calendar className="w-5 h-5 mr-2 text-indigo-600" /> 7-Day Roadmap</CardTitle>
                            <button
                                onClick={() => copyToClipboard(plan.map(p => `${p.day}: ${p.focus || p.task}`).join('\n'), 'plan')}
                                className="text-gray-400 hover:text-indigo-600 transition-colors"
                                title="Copy Plan"
                            >
                                {copied === 'plan' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {plan.map((p, i) => (
                                    <div key={i} className="flex">
                                        <div className="w-16 font-extrabold text-[10px] text-indigo-300 pt-1 uppercase">{p.day}</div>
                                        <div className="flex-1 border-l-2 border-indigo-50 pl-4 pb-4">
                                            <p className="text-sm font-bold text-gray-800 mb-1">{p.focus || p.task}</p>
                                            {p.tasks && (
                                                <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                                                    {p.tasks.map((t, idx) => <li key={idx} className="leading-relaxed">{t}</li>)}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Timeline & Checklist & Questions */}
                <div className="lg:col-span-2 space-y-6">
                    {roundMapping.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center"><ListChecks className="w-5 h-5 mr-2 text-indigo-600" /> Interview Strategy</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-50">
                                    {roundMapping.map((r, i) => (
                                        <div key={i} className="relative">
                                            <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-indigo-600 z-10 shadow-sm"></div>
                                            <div>
                                                <div className="flex items-center flex-wrap gap-2 mb-2">
                                                    <h4 className="font-bold text-gray-900 leading-none">{r.roundTitle || r.round}</h4>
                                                    {(r.focusAreas || [r.topic]).map((tag, idx) => (
                                                        <span key={idx} className="text-[9px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 uppercase tracking-tighter">{tag}</span>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-gray-500 font-medium leading-relaxed">{r.whyItMatters || r.why}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-lg flex items-center"><ListChecks className="w-5 h-5 mr-2 text-indigo-600" /> Preparation Checklist</CardTitle>
                            <button
                                onClick={() => copyToClipboard(checklist.map(r => `${r.roundTitle || r.round}:\n${(r.items || []).join('\n')}`).join('\n\n'), 'check')}
                                className="text-gray-400 hover:text-indigo-600 transition-colors"
                                title="Copy Checklist"
                            >
                                {copied === 'check' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {checklist.map((roundInfo, i) => (
                                <div key={i} className="border border-gray-100 rounded-lg p-5 bg-gray-50/50 hover:bg-white transition-colors">
                                    <h4 className="font-bold text-gray-900 mb-3">{roundInfo.roundTitle || roundInfo.round}</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                        {(roundInfo.items || []).map((item, idx) => (
                                            <li key={idx} className="flex items-start text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-indigo-400 mr-2.5 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-600">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-lg flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-indigo-600" /> Recommended Questions</CardTitle>
                            <button
                                onClick={() => copyToClipboard(data.questions.map((q, i) => `${i + 1}. ${q}`).join('\n'), 'q')}
                                className="text-gray-400 hover:text-indigo-600 transition-colors"
                                title="Copy Questions"
                            >
                                {copied === 'q' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {data.questions.map((q, i) => (
                                    <li key={i} className="flex items-start p-5 border border-indigo-50 rounded-xl bg-white shadow-sm italic text-gray-700 hover:border-indigo-200 transition-colors group">
                                        <span className="text-indigo-600 font-extrabold mr-4 opacity-50 group-hover:opacity-100 transition-opacity">{i + 1}</span>
                                        {q}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Action Next Box */}
                    <div className="bg-gradient-to-br from-indigo-900 to-gray-900 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl border border-indigo-800">
                        <div>
                            <h3 className="text-2xl font-extrabold mb-2">Priority Focus</h3>
                            <p className="text-indigo-200/80 text-sm mb-6 max-w-md leading-relaxed">
                                Mastering these specific skills will have the highest impact on your placement readiness for this job.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {weakSkills.length > 0 ? weakSkills.map(s => (
                                    <span key={s} className="px-4 py-1.5 bg-white/5 text-white border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                        {s}
                                    </span>
                                )) : <span className="text-emerald-400 font-bold flex items-center"><CheckCircle2 className="w-5 h-5 mr-2" /> Readiness Maxed 🚀</span>}
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth' });
                                copyToClipboard(plan.length > 0 ? (plan[0].focus || plan[0].task) : "", 'next');
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-5 rounded-2xl font-bold flex items-center group transition-all hover:scale-105 shadow-xl cursor-pointer flex-shrink-0"
                        >
                            {copied === 'next' ? <><CheckCircle2 className="w-5 h-5 mr-2" /> Ready to Start!</> : <><ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" /> Start Preparation</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
