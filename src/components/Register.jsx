import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Code2, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Register = () => {
    const { register } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(username, email, password);
            toast.success('Account created successfully');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.45 }}
            className="flex items-center justify-center w-full"
        >
            {/* Card */}
            <div className="w-full max-w-md p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative">

                {/* subtle glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center">

                    {/* Logo */}
                    <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-400/20 shadow-lg">
                        <Code2 className="w-7 h-7 text-indigo-400" />
                    </div>

                    {/* Title */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold tracking-tight">Create Account</h2>
                        <p className="text-sm text-gray-400 mt-1">
                            Join the Bootcamp portal
                        </p>
                    </div>

                    {/* Form */}
                    <form className="w-full space-y-4" onSubmit={handleSubmit}>

                        {/* Username */}
                        <div className="relative group">
                            <UserIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition" />
                            <input
                                type="text"
                                required
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                            />
                        </div>

                        {/* Email */}
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition" />
                            <input
                                type="email"
                                required
                                placeholder="name@bootcamp.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition" />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                            />
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-all font-medium shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Register'}
                            {!loading && (
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-sm text-gray-400 mt-6">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-indigo-400 hover:text-indigo-300 transition"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default Register;