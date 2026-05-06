import Link from 'next/link';
import { MapPin, Star, ArrowRight, Compass, Sparkles, Navigation } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

export default function Explore() {
  const destinations = [
    {
      id: 1,
      name: 'Intramuros',
      type: 'Historic Site',
      rating: 4.8,
      description: 'The historic walled city of Manila. Experience centuries of history within its stone walls and cobblestone streets.',
      image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&q=80&w=1200',
      userRatingsTotal: 15420
    },
    {
      id: 2,
      name: 'Makati CBD',
      type: 'Business District',
      rating: 4.5,
      description: 'The financial heart of the Philippines. A mix of towering skyscrapers, luxury shopping, and world-class dining.',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1200',
      userRatingsTotal: 8932
    },
    {
      id: 3,
      name: 'BGC (Bonifacio Global City)',
      type: 'Entertainment',
      rating: 4.9,
      description: 'Manila\'s most modern district. A pedestrian-friendly oasis with street art, parks, and vibrant nightlife.',
      image: 'https://images.unsplash.com/photo-1526749837599-b4efa9fd259e?auto=format&fit=crop&q=80&w=1200',
      userRatingsTotal: 12543
    },
    {
      id: 4,
      name: 'Binondo',
      type: 'Cultural Hub',
      rating: 4.7,
      description: 'The world\'s oldest Chinatown. A sensory journey of street food, traditional medicine, and hidden temples.',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=1200',
      userRatingsTotal: 6721
    },
    {
      id: 5,
      name: 'Quezon Memorial Circle',
      type: 'Public Park',
      rating: 4.4,
      description: 'A national park and shrine located in the heart of Quezon City, perfect for cycling and local recreation.',
      image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=1200',
      userRatingsTotal: 9834
    },
    {
      id: 6,
      name: 'Rizal Park',
      type: 'Historic Park',
      rating: 4.6,
      description: 'A monument to Philippine history. Lush gardens and fountains where locals gather for leisure and national pride.',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200',
      userRatingsTotal: 18234
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-rose-500/5 blur-[120px]" />
      </div>

      <Navbar />

      <main className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center sm:text-left"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-6">
            <Compass size={16} />
            DISCOVER METRO MANILA
          </span>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 tracking-tight">
            Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">Heart of Manila</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            From historic walled cities to hyper-modern business districts, find your next urban adventure with our curated selection.
          </p>
        </motion.div>

        {/* Search/Filter Bar (Visual Placeholder) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <input 
              placeholder="Search districts, parks, or landmarks..."
              className="input-glass pl-14 w-full"
            />
            <Compass className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          </div>
          <button className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all active:scale-95">
            FILTERS
          </button>
        </motion.div>

        {/* Destination Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
        >
          {destinations.map((dest) => (
            <motion.div
              key={dest.id}
              variants={itemVariants}
              className="glass-card group flex flex-col h-full"
            >
              {/* Image Container with Grayscale Effect */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={dest.image} 
                  alt={dest.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
                
                {/* Overlay Tags */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-xl">
                    <Star className="w-3.5 h-3.5 text-indigo-600 fill-current" />
                    <span className="text-xs font-black text-slate-900">{dest.rating}</span>
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-6">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                    {dest.type}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-black mb-3 group-hover:text-indigo-400 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                  {dest.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                   <div className="flex flex-col">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Activity Level</span>
                     <div className="flex gap-1">
                       <div className="w-4 h-1 rounded-full bg-indigo-500" />
                       <div className="w-4 h-1 rounded-full bg-indigo-500" />
                       <div className="w-4 h-1 rounded-full bg-slate-700" />
                     </div>
                   </div>
                   <Link
                      href={`/planner?dest=${encodeURIComponent(dest.name)}`}
                      className="flex items-center gap-2 text-indigo-400 font-bold text-sm hover:text-white transition-colors group/link"
                    >
                      PLAN TRIP
                      <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-24 glass-card p-12 text-center bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          <h2 className="text-3xl sm:text-4xl font-black mb-6 text-white relative">Can't find what you're looking for?</h2>
          <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto relative opacity-90">
            Tell our AI where you want to go and what you love, and we'll build a custom itinerary just for you.
          </p>
          <Link
            href="/planner"
            className="inline-flex items-center gap-3 bg-white text-indigo-600 px-10 py-4 rounded-full font-black text-lg hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)] transition-all active:scale-95 relative"
          >
            <Sparkles size={24} />
            OPEN PLANNER
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
