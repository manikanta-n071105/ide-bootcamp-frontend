import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const typesMap = {
    internet: { label: 'NET', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    socket: { label: 'WSS', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    hardware: { label: 'HW', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    software: { label: 'SW', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    other: { label: 'OTH', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' }
};

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await axios.get('/api/complaints', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setComplaints(res.data);
        } catch {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        const t = toast.loading('Updating...');
        try {
            await axios.put(`/api/complaints/${id}`, { status }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setComplaints(prev =>
                prev.map(c => c._id === id ? { ...c, status } : c)
            );
            toast.success('Updated', { id: t });
        } catch {
            toast.error('Update failed', { id: t });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-6 items-start sm:items-center">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-3">
                        <ShieldAlert className="w-6 h-6 text-indigo-400" />
                        Admin Panel
                    </h1>
                    <p className="text-gray-400 mt-1 text-sm">
                        Manage and resolve system reports efficiently.
                    </p>
                </div>

                {/* Stats */}
                <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                    <span className="text-2xl font-semibold">
                        {complaints.length}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">Total Tickets</p>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : complaints.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
                    <CheckCircle className="mx-auto mb-3 text-emerald-400" />
                    <p className="text-gray-400">No active issues</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {complaints.map((c, i) => {
                            const t = typesMap[c.type] || typesMap.other;

                            return (
                                <motion.div
                                    key={c._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition"
                                >
                                    <div className="flex flex-col md:flex-row justify-between gap-4">

                                        {/* Info */}
                                        <div className="space-y-2 flex-1">

                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={`text-xs px-2 py-1 rounded ${t.bg} ${t.color} border ${t.border}`}>
                                                    {t.label}
                                                </span>

                                                <span className="text-sm text-gray-300">
                                                    {c.userId?.username}
                                                </span>

                                                <span className="text-xs text-gray-500">
                                                    {c.userId?.email}
                                                </span>

                                                <span className="ml-auto text-xs text-gray-500">
                                                    {new Date(c.createdAt).toLocaleString()}
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-300">
                                                {c.description}
                                            </p>
                                        </div>

                                        {/* Action */}
                                        <div className="flex items-center">
                                            {c.status === 'pending' ? (
                                                <button
                                                    onClick={() => updateStatus(c._id, 'resolved')}
                                                    className="px-4 py-2 rounded-xl text-xs font-medium bg-emerald-600 hover:bg-emerald-500 transition text-white"
                                                >
                                                    Mark Resolved
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => updateStatus(c._id, 'pending')}
                                                    className="px-4 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 transition"
                                                >
                                                    Re-open
                                                </button>
                                            )}
                                        </div>

                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};

export default AdminPanel;