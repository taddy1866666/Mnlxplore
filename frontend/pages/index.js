import Link from 'next/link';
import { MapPin, Zap, Users, ArrowRight, Sparkles, Map, Navigation, Shield, Heart, Star, Compass, Globe, ExternalLink, PieChart, UtensilsCrossed, Car, Ticket } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.15 } 
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500/30 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-rose-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center lg:text-left grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-8">
              <Sparkles size={16} />
              THE FUTURE OF TRAVEL IN MANILA
            </span>
            <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
              Explore <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400">
                Manila Smart
              </span>
            </h1>
            <p className="text-slate-400 text-lg sm:text-2xl mb-12 max-w-xl leading-relaxed mx-auto lg:mx-0">
              Ditch the generic guides. Get hyper-personalized itineraries powered by AI, optimized for your budget and travel style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/planner"
                className="premium-button text-lg px-10 py-5 group"
              >
                START PLANNING
                <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
              </Link>
              <Link
                href="/explore"
                className="flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-white/5 border border-white/10 text-white font-black text-lg hover:bg-white/10 transition-all active:scale-95"
              >
                EXPLORE SPOTS
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[300px] sm:h-[400px] lg:h-auto"
          >
            <div className="relative z-10 glass-card p-4 bg-white/5 border-white/10 rotate-3 translate-x-12 translate-y-12">
              <img 
                src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&q=80&w=800" 
                alt="Intramuros" 
                className="rounded-[1.5rem] w-full grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="absolute top-0 right-0 z-20 glass-card p-4 bg-indigo-500/20 border-white/20 -rotate-6 -translate-x-12 -translate-y-12 shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center">
                   <Navigation size={24} className="text-white" />
                 </div>
                 <div>
                   <p className="text-white font-black">BGC DISTRICT</p>
                   <p className="text-indigo-200 text-xs font-bold">Recommended for you</p>
                 </div>
              </div>
              <div className="flex gap-2">
                 {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-indigo-400 fill-current" />)}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
           <div className="flex flex-wrap justify-center lg:justify-between items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <p className="text-2xl font-black tracking-tighter">MAPS PLATFORM</p>
              <p className="text-2xl font-black tracking-tighter">OPENAI GPT-4</p>
              <p className="text-2xl font-black tracking-tighter">METRO MANILA TOURISM</p>
              <p className="text-2xl font-black tracking-tighter">LOCAL INSIGHTS</p>
           </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-6xl font-black mb-6 tracking-tight">The Modern Way to <span className="text-gradient">Xplore</span></h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-medium">We've combined advanced AI with local expertise to create the ultimate travel companion for the Metro.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="glass-card p-10 group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-8 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 shadow-xl shadow-indigo-500/10">
                <Zap size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4">Instant Intelligence</h3>
              <p className="text-slate-400 leading-relaxed font-medium">Generate complete day-by-day itineraries in under 5 seconds. Optimized for time, distance, and your personal interests.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-card p-10 group">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-8 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500 shadow-xl shadow-rose-500/10">
                <Shield size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4">Budget Precision</h3>
              <p className="text-slate-400 leading-relaxed font-medium">No more financial surprises. Our AI calculates transportation, dining, and activity costs with localized accuracy.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-card p-8 sm:p-10 group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-8 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-xl shadow-emerald-500/10">
                <Heart size={32} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-4">Local Authenticity</h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-medium">Go beyond the tourist traps. We recommend spots that locals actually love, from hidden cafes to historic streets.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats / Impact Section */}
      <section className="py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-indigo-600/5 -skew-y-3 transform origin-right" />
         <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[
                 { label: 'Happy Travelers', value: '10K+' },
                 { label: 'Spots Indexed', value: '500+' },
                 { label: 'Trips Planned', value: '25K+' },
                 { label: 'Local Partners', value: '100+' }
               ].map((stat, i) => (
                 <div key={i} className="text-center">
                    <p className="text-4xl sm:text-6xl font-black text-white mb-2 tracking-tighter">{stat.value}</p>
                    <p className="text-slate-500 text-sm font-black uppercase tracking-widest">{stat.label}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-32">
         <div className="max-w-5xl mx-auto px-6 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card p-12 lg:p-24 bg-gradient-to-br from-indigo-900/50 to-slate-900/50 border-white/10"
            >
               <h2 className="text-4xl sm:text-6xl font-black mb-8 tracking-tighter">Ready to redefine <br /> your <span className="text-gradient">Manila Story?</span></h2>
               <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto">Join thousands of smart travelers who are discovering Metro Manila with AI-precision and local heart.</p>
               <Link
                  href="/planner"
                  className="premium-button text-xl px-12 py-6 shadow-2xl shadow-indigo-500/40"
                >
                  GET STARTED FOR FREE
                </Link>
            </motion.div>
         </div>
      </section>

      <Footer />
    </div>
  );
}
