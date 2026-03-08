import { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Lock, Rocket, ShieldCheck, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ShipLock() {
    const navigate = useNavigate();
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('prp_test_checklist');
        if (saved) {
            const checklist = JSON.parse(saved);
            const passedCount = Object.values(checklist).filter(Boolean).length;
            if (passedCount === 10) {
                setIsLocked(false);
            }
        }
    }, []);

    if (isLocked) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-amber-100 p-6 rounded-full mb-8 border-4 border-amber-50 shadow-inner">
                    <Lock className="w-12 h-12 text-amber-600" />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Shipping Locked</h1>
                <p className="max-w-md text-gray-500 text-lg mb-10 leading-relaxed font-medium">
                    You cannot access the shipping portal until all 10 items in the QA checklist are verified.
                </p>
                <button
                    onClick={() => navigate('/prp/07-test')}
                    className="flex items-center px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl hover:shadow-gray-200 group active:scale-95"
                >
                    Return to Checklist <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 py-10">
            <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-sm font-bold tracking-tight mb-8">
                    <ShieldCheck className="w-4 h-4 mr-2" /> All Tests Passed
                </div>
                <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Ready for Deployment</h1>
                <p className="max-w-2xl text-gray-500 text-xl leading-relaxed">
                    The platform has passed all internal quality gates. You are cleared to move to the production environment.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-10">
                <Card className="border-2 border-indigo-50 shadow-xl shadow-indigo-100/50 rounded-3xl overflow-hidden group hover:border-indigo-200 transition-all">
                    <CardContent className="p-10">
                        <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                            <Rocket className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-4">Production Build</h3>
                        <p className="text-gray-500 font-medium mb-8 leading-relaxed">Compile all assets and prepare the final static bundle for global distribution.</p>
                        <button className="w-full bg-gray-50 text-gray-400 py-4 rounded-xl font-bold text-sm uppercase tracking-widest border border-gray-100 cursor-not-allowed">
                            Trigger Build (Coming Soon)
                        </button>
                    </CardContent>
                </Card>

                <Card className="border-2 border-emerald-50 shadow-xl shadow-emerald-100/50 rounded-3xl overflow-hidden group hover:border-emerald-200 transition-all">
                    <CardContent className="p-10">
                        <div className="bg-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-gray-900 mb-4">Release Docs</h3>
                        <p className="text-gray-500 font-medium mb-8 leading-relaxed">Generate automated release notes based on the verified checklist items.</p>
                        <button className="w-full bg-emerald-50 text-emerald-600 py-4 rounded-xl font-bold text-sm uppercase tracking-widest border border-emerald-100 hover:bg-emerald-100 transition-all">
                            View Changelog
                        </button>
                    </CardContent>
                </Card>
            </div>

            <div className="text-center pt-10">
                <button
                    onClick={() => navigate('/prp/07-test')}
                    className="inline-flex items-center text-gray-400 hover:text-gray-600 font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to QA Environment
                </button>
            </div>
        </div>
    );
}
