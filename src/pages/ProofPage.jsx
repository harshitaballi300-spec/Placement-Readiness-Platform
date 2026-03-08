import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { CheckCircle2, Circle, Link as LinkIcon, Github, Globe, Copy, Share2, Sparkles, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

const PRP_STEPS = [
    { id: 1, label: 'UI Components & Design System', description: 'Premium SaaS aesthetics with consistent tokens.' },
    { id: 2, label: 'JD Text Analyzer Logic', description: 'Heuristic-based skill extraction from job descriptions.' },
    { id: 3, label: 'Readiness Score Algorithm', description: 'Deterministic scoring with live mastery updates.' },
    { id: 4, label: 'LocalStorage History System', description: 'Persistent analysis saving with robustness handling.' },
    { id: 5, label: '7-Day Roadmap Generator', description: 'Contextual preparation plan based on extracted skills.' },
    { id: 6, label: 'Interview Round Mapping', description: 'Adaptive technical round strategy for different company tiers.' },
    { id: 7, label: 'QA Test Environment', description: 'Integrated checklist for feature verification.' },
    { id: 8, label: 'Final Proof of Work', description: 'Submission of artifact links and metadata.' }
];

export default function ProofPage() {
    const [links, setLinks] = useState(() => {
        const saved = localStorage.getItem('prp_final_submission');
        return saved ? JSON.parse(saved) : { lovable: '', github: '', live: '' };
    });
    const [copied, setCopied] = useState(false);
    const [qaPassed, setQaPassed] = useState(false);

    useEffect(() => {
        localStorage.setItem('prp_final_submission', JSON.stringify(links));
    }, [links]);

    useEffect(() => {
        const savedQa = localStorage.getItem('prp_test_checklist');
        if (savedQa) {
            const checklist = JSON.parse(savedQa);
            const passedCount = Object.values(checklist).filter(Boolean).length;
            setQaPassed(passedCount === 10);
        }
    }, []);

    const isValidUrl = (url) => {
        try {
            const parsed = new URL(url);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch (_) {
            return false;
        }
    };

    const linksProvded = links.lovable && links.github && links.live;
    const linksValid = isValidUrl(links.lovable) && isValidUrl(links.github) && isValidUrl(links.live);

    // Status Logic
    const stepsCompleted = qaPassed && linksValid;
    const isShipped = stepsCompleted;

    const copyFinalSubmission = () => {
        const text = `------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.live}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 pb-20 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Proof of Work</h1>
                    <p className="text-gray-500 mt-2 text-lg">Validate your artifacts and finalize the platform submission.</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-bold text-sm flex items-center shadow-sm border transition-all ${isShipped ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${isShipped ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-500'}`}></div>
                    Status: {isShipped ? 'Shipped' : 'In Progress'}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Step Overview */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-2 border-gray-50">
                        <CardHeader>
                            <CardTitle className="text-xl">8-Step Roadmap</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {PRP_STEPS.map(step => {
                                const isDone = step.id < 8 ? qaPassed : stepsCompleted;
                                return (
                                    <div key={step.id} className="flex items-start">
                                        <div className={`mt-1 mr-3 flex-shrink-0 transition-colors ${isDone ? 'text-emerald-500' : 'text-gray-300'}`}>
                                            {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold ${isDone ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</p>
                                            <p className="text-[11px] text-gray-400 leading-tight">{step.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {!qaPassed && (
                        <Card className="bg-amber-50 border-amber-200">
                            <CardContent className="p-4 flex items-start">
                                <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 mt-0.5" />
                                <p className="text-xs text-amber-800 font-medium">
                                    QA Environment items are still pending. Complete the checklist at /prp/07-test to unlock shipping.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right: Artifacts & Export */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-xl shadow-indigo-100/30">
                        <CardHeader>
                            <CardTitle className="flex items-center"><Sparkles className="w-5 h-5 mr-2 text-indigo-600" /> Artifact Verification</CardTitle>
                            <CardDescription>Provide the canonical links for your build submission.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Lovable Project URL</label>
                                    <div className="relative group">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="url"
                                            value={links.lovable}
                                            onChange={(e) => setLinks({ ...links, lovable: e.target.value })}
                                            placeholder="https://lovable.dev/projects/..."
                                            className={`w-full bg-gray-50 pl-12 pr-4 py-3.5 border rounded-2xl focus:ring-2 focus:outline-none transition-all text-sm ${links.lovable && !isValidUrl(links.lovable) ? 'border-red-300 ring-red-500/10' : 'border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">GitHub Repository</label>
                                    <div className="relative group">
                                        <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="url"
                                            value={links.github}
                                            onChange={(e) => setLinks({ ...links, github: e.target.value })}
                                            placeholder="https://github.com/user/repo"
                                            className={`w-full bg-gray-50 pl-12 pr-4 py-3.5 border rounded-2xl focus:ring-2 focus:outline-none transition-all text-sm ${links.github && !isValidUrl(links.github) ? 'border-red-300 ring-red-500/10' : 'border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Live Deployed URL</label>
                                    <div className="relative group">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="url"
                                            value={links.live}
                                            onChange={(e) => setLinks({ ...links, live: e.target.value })}
                                            placeholder="https://project.vercel.app"
                                            className={`w-full bg-gray-50 pl-12 pr-4 py-3.5 border rounded-2xl focus:ring-2 focus:outline-none transition-all text-sm ${links.live && !isValidUrl(links.live) ? 'border-red-300 ring-red-500/10' : 'border-gray-200 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <button
                                    onClick={copyFinalSubmission}
                                    disabled={!linksValid}
                                    className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-gray-200"
                                >
                                    {copied ? <><CheckCircle2 className="w-5 h-5 mr-2" /> Copied Submission!</> : <><Copy className="w-5 h-5 mr-2" /> Copy Final Submission</>}
                                </button>
                                <p className="mt-4 text-center text-xs text-gray-400 font-medium">Valid artifacts are required to unlock the final "Shipped" status.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {isShipped && (
                        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-10 text-white shadow-2xl shadow-emerald-200 animate-in zoom-in duration-500">
                            <div className="flex items-center mb-6">
                                <div className="bg-white/20 p-3 rounded-2xl mr-4 backdrop-blur-md">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-black tracking-tight">System Shipped.</h3>
                            </div>
                            <p className="text-emerald-50 text-xl font-medium mb-8 leading-relaxed italic">
                                "You built a real product. <br />
                                Not a tutorial. Not a clone. <br />
                                A structured tool that solves a real problem.<br />
                                <span className="not-italic font-black mt-4 block text-white">— This is your proof of work."</span>
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-sm font-bold flex items-center">
                                    <Globe className="w-4 h-4 mr-2" /> Live & Public
                                </div>
                                <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-sm font-bold flex items-center">
                                    <Github className="w-4 h-4 mr-2" /> Repo Verified
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
