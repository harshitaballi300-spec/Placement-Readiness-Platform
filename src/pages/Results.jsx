import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { getHistoryEntry } from '../lib/analyzer';
import { ArrowLeft, CheckCircle2, ListChecks, Calendar, MessageSquare, Target } from 'lucide-react';

export default function Results() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    useEffect(() => {
        const entry = getHistoryEntry(id);
        if (entry) {
            setData(entry);
        }
    }, [id]);

    if (!data) return <div className="p-8 text-gray-600 font-medium">Loading analysis...</div>;

    return (
        <div className="space-y-6 pb-12">
            <div>
                <button onClick={() => navigate('/assessments')} className="flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors cursor-pointer">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Analyzer
                </button>
                <h1 className="text-3xl font-bold text-gray-900">{data.role} Analysis</h1>
                <p className="text-gray-500 mt-1">{data.company} • Computed Readiness: <span className="font-bold text-indigo-600">{data.readinessScore}/100</span></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* Left Column: Skills & Plan */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><Target className="w-5 h-5 mr-2 text-indigo-600" /> Detected Skills</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Object.entries(data.extractedSkills).map(([cat, skills]) => (
                                <div key={cat}>
                                    <h4 className="text-sm font-bold text-gray-700 mb-2">{cat}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map(s => (
                                            <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100 uppercase tracking-wider">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><Calendar className="w-5 h-5 mr-2 text-indigo-600" /> 7-Day Quick Plan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.plan.map((p, i) => (
                                    <div key={i} className="flex">
                                        <div className="w-16 font-bold text-sm text-gray-500 pt-0.5">{p.day}</div>
                                        <div className="flex-1 text-sm font-medium text-gray-800 border-l-2 border-indigo-100 pl-4 pb-4">{p.task}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Checklist & Questions */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><ListChecks className="w-5 h-5 mr-2 text-indigo-600" /> Interview Rounds Checklist</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {data.checklist.map((roundInfo, i) => (
                                <div key={i} className="border border-gray-100 rounded-lg p-5 bg-gray-50/50">
                                    <h4 className="font-bold text-lg text-gray-900 mb-3">{roundInfo.round}</h4>
                                    <ul className="space-y-2.5">
                                        {roundInfo.items.map((item, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0 flex-shrink-0" />
                                                <span className="text-gray-700 font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-indigo-600" /> Likely Interview Questions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {data.questions.map((q, i) => (
                                    <li key={i} className="flex items-start p-4 border border-gray-100 rounded-lg hover:border-indigo-200 bg-white transition-colors shadow-sm">
                                        <span className="flex-shrink-0 w-7 h-7 bg-indigo-50 text-indigo-700 rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0">{i + 1}</span>
                                        <span className="text-base font-medium text-gray-800">{q}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
