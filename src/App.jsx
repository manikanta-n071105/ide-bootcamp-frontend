import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return null;
    return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return null;
    return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

const AppRoutes = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-950 text-slate-100 font-['Inter'] selection:bg-indigo-500/30">

            {/* 🔥 Premium Gradient Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[160px]" />
                <div className="absolute top-[10%] right-[-10%] w-[40%] h-[50%] bg-blue-500/20 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[160px]" />
            </div>

            {/* ✨ Subtle Grid + Noise */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px]"></div>

            {/* 🌐 Main Layout */}
            <div className="relative z-10 flex flex-col min-h-screen">

                {/* Navbar */}
                {user && <Navbar />}

                {/* Page Container */}
                <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-10 py-10">
                    <AnimatePresence mode="wait">
                        <Routes>
                            <Route
                                path="/login"
                                element={
                                    !user ? (
                                        <Login />
                                    ) : (
                                        <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />
                                    )
                                }
                            />
                            <Route
                                path="/register"
                                element={
                                    !user ? (
                                        <Register />
                                    ) : (
                                        <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />
                                    )
                                }
                            />
                            <Route
                                path="/dashboard"
                                element={
                                    <PrivateRoute>
                                        <Dashboard />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/admin"
                                element={
                                    <AdminRoute>
                                        <AdminPanel />
                                    </AdminRoute>
                                }
                            />
                            <Route
                                path="*"
                                element={
                                    <Navigate
                                        to={
                                            user
                                                ? user.role === 'admin'
                                                    ? '/admin'
                                                    : '/dashboard'
                                                : '/login'
                                        }
                                    />
                                }
                            />
                        </Routes>
                    </AnimatePresence>
                </main>
            </div>

            {/* 🔔 Toast System (Refined) */}
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'rgba(15, 23, 42, 0.85)',
                        color: '#F1F5F9',
                        border: '1px solid rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '14px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                    },
                    success: {
                        iconTheme: {
                            primary: '#22C55E',
                            secondary: '#0F172A'
                        }
                    },
                    error: {
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#0F172A'
                        }
                    }
                }}
            />
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;