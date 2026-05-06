import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '../utils/api';
import { Loader, Trash2, Calendar, DollarSign, MapPin, Eye, Compass, Sparkles, LayoutDashboard, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      const response = await apiClient.get(`/api/trips`);
      setTrips(response.data.trips || []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        setError('Unable to synchronize your journeys.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tripId) => {
    if (!confirm('Discard this journey forever?')) return;
    try {
      await apiClient.delete(`/api/trips/${tripId}`);
      setTrips(trips.filter(t => t._id !== tripId));
    } catch (err) {
      setError('Failed to remove the trip.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-rose-500/5 blur-[120px]" />
      </div>

      <Navbar />

      <main className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-6">
              <LayoutDashboard size={16} />
              COMMAND CENTER
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">Journeys</span>
            </h1>
            <p className="text-slate-400 text-lg mt-4 max-w-xl">
              Access and manage your AI-crafted itineraries and planned adventures across Metro Manila.
            </p>
          </div>
          
          <Link
            href="/planner"
            className="premium-button px-8 py-4 text-sm group"
          >
            <Sparkles size={18} />
            PLAN NEW TRIP
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold mb-12 flex items-center gap-3"
          >
            <Compass size={20} />
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <Loader className="animate-spin text-indigo-500" size={48} />
            <p className="text-slate-500 font-black uppercase tracking-widest text-sm">Synchronizing Data...</p>
          </div>
        ) : trips.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 sm:p-24 text-center border-dashed border-white/10"
          >
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/10">
              <Compass size={48} className="text-slate-600" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mb-4">No Journeys Found</h3>
            <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto">
              Your dashboard looks a bit empty. Ready to start your first AI-guided adventure?
            </p>
            <Link
              href="/planner"
              className="premium-button inline-flex px-12 py-5"
            >
              CREATE FIRST TRIP
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {trips.map((trip) => (
              <motion.div
                key={trip._id}
                variants={itemVariants}
                className="glass-card group h-full flex flex-col"
              >
                {/* Visual Header */}
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-indigo-500/20 to-purple-600/20">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)]" />
                   <div className="absolute top-6 left-8">
                      <h3 className="text-2xl font-black text-white group-hover:text-indigo-300 transition-colors line-clamp-1">{trip.destination}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest">
                          {trip.status || 'Archived'}
                        </span>
                        <span className="text-[10px] text-white/40 font-bold tracking-widest">ID: {trip._id.slice(-6).toUpperCase()}</span>
                      </div>
                   </div>
                   <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all">
                      <MapPin size={120} />
                   </div>
                </div>

                <div className="p-8 space-y-6 flex-1 flex flex-col">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Budget</p>
                      <p className="text-lg font-black text-emerald-400">₱{trip.budget?.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Duration</p>
                      <p className="text-lg font-black text-indigo-400">{trip.days} Day{trip.days > 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-4 border-y border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Created On</p>
                      <p className="text-sm font-bold text-slate-300">
                        {new Date(trip.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 mt-auto">
                    <Link
                      href={`/planner?id=${trip._id}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                    >
                      <Eye size={16} />
                      REVISIT
                    </Link>
                    <button
                      onClick={() => handleDelete(trip._id)}
                      className="w-14 flex items-center justify-center bg-white/5 border border-white/10 text-slate-500 hover:text-rose-400 hover:border-rose-400/30 hover:bg-rose-400/5 rounded-2xl transition-all active:scale-90"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
