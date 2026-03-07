import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import AppShell from './components/AppShell';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import Assessments from './pages/Assessments';
import Results from './pages/Results';
import Resources from './pages/Resources';
import Profile from './pages/Profile';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route element={<AppShell />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/practice" element={<Practice />} />
                    <Route path="/assessments" element={<Assessments />} />
                    <Route path="/results/:id" element={<Results />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
