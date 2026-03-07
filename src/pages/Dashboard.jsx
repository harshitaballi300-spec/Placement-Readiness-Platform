import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Briefcase, CalendarClock, ChevronRight } from 'lucide-react';

const mockRadarData = [
    { subject: 'DSA', A: 75, fullMark: 100 },
    { subject: 'System Design', A: 60, fullMark: 100 },
    { subject: 'Communication', A: 80, fullMark: 100 },
    { subject: 'Resume', A: 85, fullMark: 100 },
    { subject: 'Aptitude', A: 70, fullMark: 100 },
];

export default function Dashboard() {
    const [progress, setProgress] = useState(0);
    const targetReadiness = 72;

    // Animation for the circular progress
    useEffect(() => {
        let current = 0;
        const interval = setInterval(() => {
            current += 2;
            if (current >= targetReadiness) {
                setProgress(targetReadiness);
                clearInterval(interval);
            } else {
                setProgress(current);
            }
        }, 20);
        return () => clearInterval(interval);
    }, [targetReadiness]);

    // SVG Circle properties
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Check your current readiness and stay on track.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Overall Readiness */}
                <Card>
                    <CardHeader>
                        <CardTitle>Overall Readiness</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center pt-4">
                        <div className="relative flex items-center justify-center w-40 h-40">
                            {/* Background Circle */}
                            <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 160 160">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r={radius}
                                    stroke="#e2e8f0"
                                    strokeWidth="12"
                                    fill="transparent"
                                />
                                {/* Progress Circle border-primary equivalent */}
                                <circle
                                    cx="80"
                                    cy="80"
                                    r={radius}
                                    stroke="hsl(245, 58%, 51%)"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    className="transition-all duration-300 ease-out"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center text-center">
                                <span className="text-4xl font-extrabold text-gray-900">{progress}</span>
                                <span className="text-sm font-medium text-gray-500">/ 100</span>
                            </div>
                        </div>
                        <p className="mt-6 text-gray-600 font-medium">Readiness Score</p>
                    </CardContent>
                </Card>

                {/* Skill Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Skill Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64 pt-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockRadarData}>
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Skills"
                                    dataKey="A"
                                    stroke="hsl(245, 58%, 51%)"
                                    fill="hsl(245, 58%, 51%)"
                                    fillOpacity={0.4}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Continue Practice */}
                <Card>
                    <CardHeader>
                        <CardTitle>Continue Practice</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm font-medium text-indigo-600 mb-1">In Progress</p>
                                <h4 className="text-lg font-bold text-gray-900">Dynamic Programming</h4>
                            </div>
                            <div className="bg-indigo-50 p-2 rounded-lg">
                                <Briefcase className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500 font-medium">3/10 Completed</span>
                                <span className="text-indigo-600 font-bold">30%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-primary h-2.5 rounded-full" style={{ width: '30%' }}></div>
                            </div>
                        </div>

                        <button className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-lg flex items-center justify-center font-medium transition-colors">
                            Continue <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                    </CardContent>
                </Card>

                {/* Weekly Goals & Upcoming Assessments nested grid */}
                <div className="grid grid-cols-1 gap-6">

                    {/* Weekly Goals */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly Goals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-5">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-gray-700">Problems Solved</span>
                                    <span className="text-gray-500">12/20 this week</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                            </div>

                            <p className="text-sm font-medium text-gray-500 mb-3">Activity</p>
                            <div className="flex justify-between items-center px-2">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, ix) => (
                                    <div key={ix} className="flex flex-col items-center gap-2">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                        ${[0, 1, 3, 4].includes(ix) ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300' : 'bg-gray-100 text-gray-400'}`}
                                        >
                                            {day}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Assessments */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Assessments</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { title: 'DSA Mock Test', time: 'Tomorrow, 10:00 AM', color: 'bg-blue-500' },
                                { title: 'System Design Review', time: 'Wed, 2:00 PM', color: 'bg-purple-500' },
                                { title: 'HR Interview Prep', time: 'Friday, 11:00 AM', color: 'bg-emerald-500' }
                            ].map((assessment, i) => (
                                <div key={i} className="flex items-start">
                                    <div className="mr-4 mt-1 bg-gray-50 border border-gray-100 p-2 rounded-lg">
                                        <CalendarClock className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-gray-900">{assessment.title}</h5>
                                        <p className="text-sm text-gray-500">{assessment.time}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
