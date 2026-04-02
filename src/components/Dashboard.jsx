import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const typesMap = {
    internet: { label: 'Network', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-500' },
    socket: { label: 'Websocket', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', dot: 'bg-indigo-500' },
    hardware: { label: 'Hardware', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', dot: 'bg-rose-500' },
    software: { label: 'Software Bug', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', dot: 'bg-purple-500' },
    other: { label: 'Other', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-500' }
};

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [type, setType] = useState('internet');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await axios.get('/api/complaints/me', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setComplaints(res.data);
        } catch {
            toast.error('Failed to load complaints');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const t = toast.loading('Submitting...');
        try {
            await axios.post('/api/complaints', { type, description }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            toast.success('Submitted successfully', { id: t });
            setType('internet');
            setDescription('');
            fetchComplaints();
        } catch {
            toast.error('Submission failed', { id: t });
        }
        setLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
        >
            {/* Header */}
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
                <p className="text-gray-400 mt-1">
                    Monitor issues and submit reports in real time.
                </p>
            </div>

            {/* Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* 🔷 Form */}
                <div className="lg:col-span-4">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">

                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-indigo-400" />
                            New Ticket
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Select */}
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                            >
                                {Object.entries(typesMap).map(([key, val]) => (
                                    <option key={key} value={key} className="bg-slate-900">
                                        {val.label}
                                    </option>
                                ))}
                            </select>

                            {/* Textarea */}
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the issue..."
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none text-sm min-h-[120px]"
                            />

                            {/* Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-medium shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Submit Ticket'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* 🔷 List */}
                <div className="lg:col-span-8 space-y-4">

                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Recent Logs</h2>
                        <span className="text-sm text-gray-400">
                            {complaints.length} records
                        </span>
                    </div>

                    {complaints.length === 0 ? (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
                            <CheckCircle className="mx-auto mb-3 text-emerald-400" />
                            <p className="text-gray-400">No issues reported yet</p>
                        </div>
                    ) : (
                        complaints.map((c, i) => {
                            const t = typesMap[c.type] || typesMap.other;
                            return (
                                <motion.div
                                    key={c._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition"
                                >
                                    <div className="flex justify-between items-start gap-4">

                                        <div className="space-y-2">
                                            <span className={`text-xs px-2 py-1 rounded ${t.bg} ${t.color} border ${t.border}`}>
                                                {t.label}
                                            </span>

                                            <p className="text-sm text-gray-300">
                                                {c.description}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {new Date(c.createdAt).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className={`text-xs px-2 py-1 rounded border flex items-center gap-1 ${
                                            c.status === 'resolved'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        }`}>
                                            {c.status === 'resolved'
                                                ? <CheckCircle className="w-3 h-3" />
                                                : <Clock className="w-3 h-3" />
                                            }
                                            {c.status}
                                        </div>

                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;