import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Code, Video, BarChart, User, Menu } from 'lucide-react';
import { useState } from 'react';

export default function AppShell() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Practice', path: '/practice', icon: Code },
        { name: 'Assessments', path: '/assessments', icon: Video },
        { name: 'Resources', path: '/resources', icon: BarChart },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className={`bg-gray-900 text-white w-64 flex-shrink-0 flex flex-col transition-transform duration-300 ease-in-out z-20 ${sidebarOpen ? 'translate-x-0 absolute inset-y-0 left-0' : '-translate-x-full absolute inset-y-0 left-0'} md:relative md:translate-x-0`}>
                <div className="h-16 flex items-center px-6 bg-gray-950 font-bold text-xl tracking-tight">
                    <span className="text-indigo-400">Placement</span><span className="text-white">Prep</span>
                </div>
                <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-primary text-white'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                <span className="font-medium">{item.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content wrapper */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm z-10">
                    <div className="flex items-center">
                        <button
                            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-semibold text-gray-800 ml-4 md:ml-0">Placement Prep</h2>
                    </div>
                    <div className="flex items-center">
                        <button className="flex items-center focus:outline-none">
                            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-sm">
                                US
                            </div>
                        </button>
                    </div>
                </header>

                {/* Main scrollable area */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-10 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
