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
        const currentStatus = data.skillConfidenceMap[skill] || 'practice';
        const newStatus = currentStatus === 'know' ? 'practice' : 'know';

        // Calculate new live score
        let scoreDelta = 0;
        const allSkills = Object.values(data.extractedSkills).flat();

        const updatedMap = { ...data.skillConfidenceMap, [skill]: newStatus };

        allSkills.forEach(s => {
            const status = updatedMap[s] || 'practice';
            if (status === 'know') scoreDelta += 2;
            else scoreDelta -= 2;
        });

        const newScore = Math.max(0, Math.min(100, (data.originalReadinessScore || data.readinessScore) + scoreDelta));

        const updatedData = {
            ...data,
            skillConfidenceMap: updatedMap,
            readinessScore: newScore
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
        const content = `
ANALYSIS FOR: ${data.role} at ${data.company}
READINESS SCORE: ${data.readinessScore}/100
DATE: ${new Date(data.createdAt).toLocaleDateString()}

7-DAY PLAN:
${data.plan.map(p => `${p.day}: ${p.task}`).join('\n')}

CHECKLIST:
${data.checklist.map(r => `\n${r.round}:\n${r.items.map(i => `- ${i}`).join('\n')}`).join('\n')}

10 LIKELY INTERVIEW QUESTIONS:
${data.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
    `;
        const element = document.createElement("a");
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Prep_Plan_${data.company}.txt`;
        document.body.appendChild(element);
        element.click();
    };

    const weakSkills = Object.values(data.extractedSkills).flat()
        .filter(s => (data.skillConfidenceMap[s] || 'practice') === 'practice')
        .slice(0, 3);

    return (
        <div className="space-y-6 pb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <button onClick={() => navigate('/assessments')} className="flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors cursor-pointer">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Analyzer
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">{data.role} Analysis</h1>
                    <p className="text-gray-500 mt-1">{data.company} • Computed Readiness: <span className="font-bold text-indigo-600 transition-all duration-300">{data.readinessScore}/100</span></p>
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

                {/* Left Column: Skills & Plan */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg flex items-center"><Target className="w-5 h-5 mr-2 text-indigo-600" /> Skill Assessment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-gray-500 italic mb-2">Toggle skills you've mastered to update your live readiness score.</p>
                            {Object.entries(data.extractedSkills).map(([cat, skills]) => (
                                <div key={cat} className="space-y-2">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{cat}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map(s => {
                                            const isKnow = data.skillConfidenceMap[s] === 'know';
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

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-lg flex items-center"><Calendar className="w-5 h-5 mr-2 text-indigo-600" /> 7-Day Plan</CardTitle>
                            <button
                                onClick={() => copyToClipboard(data.plan.map(p => `${p.day}: ${p.task}`).join('\n'), 'plan')}
                                className="text-gray-400 hover:text-indigo-600 transition-colors"
                                title="Copy Plan"
                            >
                                {copied === 'plan' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.plan.map((p, i) => (
                                    <div key={i} className="flex">
                                        <div className="w-16 font-bold text-xs text-gray-400 pt-1">{p.day}</div>
                                        <div className="flex-1 text-sm font-medium text-gray-700 border-l-2 border-indigo-50 pl-4 pb-4">{p.task}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Checklist & Questions */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-lg flex items-center"><ListChecks className="w-5 h-5 mr-2 text-indigo-600" /> Prep Checklist</CardTitle>
                            <button
                                onClick={() => copyToClipboard(data.checklist.map(r => `${r.round}:\n${r.items.join('\n')}`).join('\n\n'), 'check')}
                                className="text-gray-400 hover:text-indigo-600 transition-colors"
                                title="Copy Checklist"
                            >
                                {copied === 'check' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {data.checklist.map((roundInfo, i) => (
                                <div key={i} className="border border-gray-100 rounded-lg p-5 bg-gray-50/50">
                                    <h4 className="font-bold text-gray-900 mb-3">{roundInfo.round}</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                        {roundInfo.items.map((item, idx) => (
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
                            <CardTitle className="text-lg flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-indigo-600" /> Interview Questions</CardTitle>
                            <button
                                onClick={() => copyToClipboard(data.questions.map((q, i) => `${i + 1}. ${q}`).join('\n'), 'q')}
                                className="text-gray-400 hover:text-indigo-600 transition-colors"
                                title="Copy Questions"
                            >
                                {copied === 'q' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {data.questions.map((q, i) => (
                                    <li key={i} className="flex items-start p-4 border border-gray-50 rounded-lg bg-white shadow-sm italic text-gray-700">
                                        <span className="text-indigo-600 font-bold mr-3">{i + 1}.</span>
                                        {q}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Action Next Box */}
                    <div className="bg-indigo-900 text-white rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-indigo-800">
                        <div>
                            <h3 className="text-xl font-bold mb-2">Action Next: Focus Areas</h3>
                            <p className="text-indigo-200 text-sm mb-4 max-w-md">
                                Based on your assessment, focus on mastering these top 3 areas to maximize your readiness score.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {weakSkills.length > 0 ? weakSkills.map(s => (
                                    <span key={s} className="px-3 py-1 bg-white/10 text-white border border-white/20 rounded-full text-xs font-medium uppercase tracking-wider">
                                        {s}
                                    </span>
                                )) : <span className="text-green-400 font-bold tracking-tight">Full Skill Coverage Achieved 🚀</span>}
                            </div>
                        </div>
                        <button
                            onClick={() => copyToClipboard(data.plan[0].task, 'next')}
                            className="bg-white text-indigo-900 px-6 py-4 rounded-xl font-bold flex items-center group transition-all hover:scale-105 shadow-lg cursor-pointer flex-shrink-0"
                        >
                            Start Day 1 Plan Now <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
