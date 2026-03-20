import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Skills from './pages/Skills'
import CareerPath from './pages/CareerPath'
import Dashboard from './pages/Dashboard'
import SkillTest from './pages/SkillTest'
import SignIn from './pages/SignIn'
import Onboarding from './pages/Onboarding'
import Navbar from './components/Navbar'
import Chatbot from './components/Chatbot'
import { AuthProvider } from './context/AuthContext'

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-background relative overflow-hidden">
                    {/* Background Gradients */}
                    <div className="fixed inset-0 z-0 pointer-events-none">
                        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px]" />
                    </div>

                    <div className="relative z-10 font-sans flex flex-col min-h-screen">
                        <Navbar />
                        <main className="container mx-auto px-4 py-8 flex-1">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/skills" element={<Skills />} />
                                <Route path="/career-path" element={<CareerPath />} />
                                <Route path="/skill-test" element={<SkillTest />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/sign-in" element={<SignIn />} />
                                <Route path="/onboarding" element={<Onboarding />} />
                            </Routes>
                        </main>
                        <Chatbot />
                    </div>
                </div>
            </Router>
        </AuthProvider>
    )
}

export default App
