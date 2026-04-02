import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, LogOut, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
                <div className="flex items-center justify-between h-[72px]">

                    {/* 🔷 Logo */}
                    <Link
                        to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                        className="flex items-center gap-3 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
                            <Terminal className="h-5 w-5 text-white" />
                        </div>

                        <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Bootcamp IDE
                        </span>
                    </Link>

                    {/* 🔷 Right Section */}
                    <div className="flex items-center gap-4 sm:gap-6">

                        {/* Admin Badge */}
                        {user?.role === 'admin' && (
                            <span className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg text-[11px] font-semibold tracking-wider uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                                <ShieldAlert className="h-3.5 w-3.5" />
                                Admin
                            </span>
                        )}

                        {/* Username */}
                        <span className="hidden sm:block text-sm text-gray-400">
                            <span className="text-white font-medium">{user?.username}</span>
                        </span>

                        {/* Divider */}
                        <div className="hidden sm:block w-px h-5 bg-white/10" />

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
                        >
                            <span className="hidden sm:inline">Sign Out</span>
                            <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;