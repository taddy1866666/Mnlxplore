import { useForm } from 'react-hook-form';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../utils/api';
import { 
  Loader, Sparkles, MapPin, DollarSign, Calendar, Heart, Save, 
  PieChart, UtensilsCrossed, Car, Ticket, Navigation, Clock, 
  TrendingUp, Coffee, Utensils, Landmark, Mountain, Moon, 
  Star, ExternalLink, Info, CheckCircle2, ChevronRight, Search,
  ArrowRight, Wind, Globe, Shield
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Planner() {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      budget: 5000,
      days: 1
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState('');
  const [tripData, setTripData] = useState(null);
  const [budgetBreakdown, setBudgetBreakdown] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [travelMode, setTravelMode] = useState('walking');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [curatedPlaces, setCuratedPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeTravelInfo, setPlaceTravelInfo] = useState(null);
  const [loadingPlaceInfo, setLoadingPlaceInfo] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [currentDestination, setCurrentDestination] = useState('');
  const [step, setStep] = useState(1); // 1: Setup, 2: Suggestions/Results

  const resultsRef = useRef(null);

  const themePreferences = [
    { id: 'romantic', name: 'Romantic', icon: Heart, color: 'from-pink-500/20 to-rose-500/20', text: 'text-rose-400' },
    { id: 'food', name: 'Food Trip', icon: Utensils, color: 'from-orange-500/20 to-amber-500/20', text: 'text-amber-400' },
    { id: 'cafe', name: 'Café Hopping', icon: Coffee, color: 'from-amber-600/20 to-orange-600/20', text: 'text-orange-400' },
    { id: 'cultural', name: 'Cultural', icon: Landmark, color: 'from-indigo-500/20 to-blue-500/20', text: 'text-indigo-400' },
    { id: 'shopping', name: 'Malls & Shopping', icon: Mountain, color: 'from-emerald-500/20 to-teal-500/20', text: 'text-emerald-400' },
    { id: 'nightlife', name: 'Nightlife', icon: Moon, color: 'from-violet-600/20 to-indigo-600/20', text: 'text-violet-400' }
  ];

  const travelModes = [
    { id: 'walking', name: 'Walking', icon: '🚶', desc: 'Free' },
    { id: 'motorcycle', name: 'Bike', icon: '🛵', desc: 'Fast' },
    { id: 'driving', name: 'Car', icon: '🚗', desc: 'Private' },
    { id: 'transit', name: 'Transit', icon: '🚌', desc: 'Local' }
  ];

  const watchedDestination = watch('destination');

  const calculateBudgetBreakdown = (budget, distanceKm = 0, mode = 'walking', days = 1) => {
    let dailyTransport = 0;
    const GAS_PRICE = 70;
    if (mode === 'driving') dailyTransport = ((distanceKm / 10) * GAS_PRICE * 2) + 150;
    else if (mode === 'motorcycle') dailyTransport = ((distanceKm / 50) * GAS_PRICE * 2) + 150;
    else if (mode === 'transit') dailyTransport = ((20 + (distanceKm * 2)) * 2) + 120;
    
    let transport = Math.round(dailyTransport * days);
    let error = transport > budget ? "Budget too low for transport." : transport > budget * 0.7 ? "Transport takes 70%+ of budget." : null;
    const remainingBudget = Math.max(0, budget - transport);
    return { food: Math.round(remainingBudget * 0.5), transport, activities: Math.round(remainingBudget * 0.5), budgetError: error };
  };

  const getUserLocation = () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (p) => {
            const loc = { lat: p.coords.latitude, lng: p.coords.longitude };
            setUserLocation(loc);
            resolve(loc);
          },
          () => {
            const def = { lat: 14.5995, lng: 120.9842 };
            setUserLocation(def);
            resolve(def);
          }
        );
      } else {
        const def = { lat: 14.5995, lng: 120.9842 };
        setUserLocation(def);
        resolve(def);
      }
    });
  };

  const fetchSuggestions = async (dest, theme) => {
    if (!dest || dest.length < 3) return;
    setLoadingSuggestions(true);
    try {
      const res = await apiClient.post(`/api/places/curated`, { destination: dest, theme });
      if (res.data?.places) setCuratedPlaces(res.data.places);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    if (watchedDestination?.length >= 3) {
      const timer = setTimeout(() => fetchSuggestions(watchedDestination, selectedTheme), 800);
      return () => clearTimeout(timer);
    }
  }, [watchedDestination, selectedTheme]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const loc = await getUserLocation();
      const transportRes = await apiClient.post(`/api/places/calculate-distance`, {
        origin: `${loc.lat},${loc.lng}`,
        destination: data.destination,
        travelMode: travelMode === 'motorcycle' ? 'driving' : travelMode
      });
      
      const dist = parseFloat(transportRes.data.distance);
      const breakdown = calculateBudgetBreakdown(data.budget, dist, travelMode, data.days);
      setBudgetBreakdown(breakdown);
      setTripData({ ...data, travelMode, theme: selectedTheme, transportInfo: transportRes.data });

      const itineraryRes = await apiClient.post(`/api/trips/generate`, {
        ...data,
        theme: selectedTheme,
        suggestedPlaces: curatedPlaces
      });
      
      setItinerary(itineraryRes.data.itinerary);
      setStep(2);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate your adventure.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceClick = async (place) => {
    setSelectedPlace(place);
    setLoadingPlaceInfo(true);
    const loc = userLocation || await getUserLocation();
    try {
      const res = await apiClient.post(`/api/places/calculate-distance`, {
        origin: `${loc.lat},${loc.lng}`,
        destination: `${place.lat},${place.lng}`,
        travelMode: travelMode === 'motorcycle' ? 'driving' : travelMode
      });
      setPlaceTravelInfo(res.data);
    } catch (err) { console.error(err); }
    finally { setLoadingPlaceInfo(false); }
  };

  const handleSaveTrip = async () => {
    setSaving(true);
    try {
      await apiClient.post(`/api/trips/save`, { ...tripData, itinerary });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save trip');
    } finally {
      setSaving(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-500/5 blur-[120px] animate-float" style={{ animationDelay: '-4s' }} />
      </div>

      <Navbar />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 lg:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-6">
            <Sparkles size={16} />
            AI-POWERED TRIP PLANNER
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black mb-6 tracking-tight leading-tight">
            Design Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400">Perfect Manila</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto">
            Our AI analyzes thousands of data points to craft a personalized journey through Metro Manila, optimized for your budget and travel style.
          </p>
        </motion.div>

        {/* Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (Left/Top) */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-8 space-y-6 sm:space-y-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-5 sm:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Destination */}
                <motion.div variants={itemVariants} className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                    <MapPin size={18} className="text-indigo-400" />
                    Where are you heading?
                  </label>
                  <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                    <input
                      {...register('destination', { required: 'Tell us where you want to go' })}
                      placeholder="e.g. BGC, Makati..."
                      className="input-glass pl-14 sm:pl-16 text-base sm:text-xl font-medium"
                    />
                  </div>
                  {errors.destination && <p className="mt-2 text-rose-400 text-sm font-medium flex items-center gap-1"><Info size={14} /> {errors.destination.message}</p>}
                </motion.div>

                {/* Budget */}
                <motion.div variants={itemVariants}>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                    <DollarSign size={18} className="text-emerald-400" />
                    Total Budget (₱)
                  </label>
                  <input
                    type="number"
                    {...register('budget', { required: true, min: 500 })}
                    className="input-glass text-lg sm:text-xl font-medium"
                    placeholder="5000"
                  />
                  <p className="mt-2 text-slate-500 text-xs">Minimum ₱500 recommended</p>
                </motion.div>

                {/* Days */}
                <motion.div variants={itemVariants}>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                    <Calendar size={18} className="text-rose-400" />
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    {...register('days', { required: true, min: 1, max: 7 })}
                    className="input-glass text-lg sm:text-xl font-medium"
                    placeholder="1"
                  />
                  <p className="mt-2 text-slate-500 text-xs">Max 7 days for local trips</p>
                </motion.div>

                {/* Themes */}
                <motion.div variants={itemVariants} className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
                    <Wind size={18} className="text-indigo-400" />
                    Select Your Adventure Theme
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {themePreferences.map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`relative group flex flex-col items-center gap-3 p-6 rounded-[1.5rem] border transition-all duration-300 ${
                          selectedTheme === theme.id 
                            ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]' 
                            : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.08]'
                        }`}
                      >
                        <div className={`p-3 rounded-2xl ${selectedTheme === theme.id ? 'bg-white/20' : 'bg-slate-800'}`}>
                          <theme.icon size={24} className={selectedTheme === theme.id ? 'text-white' : theme.text} />
                        </div>
                        <span className={`text-sm font-bold ${selectedTheme === theme.id ? 'text-white' : 'text-slate-300'}`}>
                          {theme.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Travel Mode */}
                <motion.div variants={itemVariants} className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
                    <Navigation size={18} className="text-amber-400" />
                    Transportation Mode
                  </label>
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
                    {travelModes.map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setTravelMode(mode.id)}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300 ${
                          travelMode === mode.id 
                            ? 'bg-slate-100 text-slate-900 border-white' 
                            : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <span className="text-2xl">{mode.icon}</span>
                        <div className="text-left">
                          <p className="text-sm font-bold leading-none mb-1">{mode.name}</p>
                          <p className={`text-[10px] font-medium opacity-60 ${travelMode === mode.id ? 'text-slate-900' : 'text-slate-400'}`}>
                            {mode.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Submit Button */}
              <motion.div variants={itemVariants} className="mt-12">
                <button
                  type="submit"
                  disabled={loading}
                  className="premium-button w-full text-lg sm:text-xl py-6 group"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={24} />
                      PLANNING YOUR ADVENTURE...
                    </>
                  ) : (
                    <>
                      <Sparkles size={24} />
                      GENERATE FULL ITINERARY
                      <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
                {error && <p className="mt-4 text-center text-rose-400 font-bold">{error}</p>}
              </motion.div>
            </form>
          </motion.div>

          {/* Suggestions Sidebar (Right/Bottom) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-8 border-indigo-500/20">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <TrendingUp className="text-indigo-400" />
                Featured Spots
              </h3>
              
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {loadingSuggestions ? (
                    [1,2,3].map(i => (
                      <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
                    ))
                  ) : curatedPlaces.length > 0 ? (
                    curatedPlaces.slice(0, 5).map((place, idx) => (
                      <motion.button
                        key={place.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => handlePlaceClick(place)}
                        className="w-full group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/5 p-4 text-left transition-all hover:bg-white/[0.08] hover:border-white/20 active:scale-95"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">{place.name}</h4>
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-400 text-[10px] font-black">
                            <Star size={10} fill="currentColor" />
                            {place.rating || '4.5'}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                          {place.description || 'A must-visit spot that perfectly matches your selected theme and preferences.'}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <MapPin size={10} /> {place.vicinity?.split(',').slice(-2, -1) || 'Metro Manila'}
                          </span>
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                            {'₱'.repeat(place.priceLevel || 2)}
                          </span>
                        </div>
                      </motion.button>
                    ))
                  ) : (
                    <div className="py-12 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-600">
                        <Search size={32} />
                      </div>
                      <p className="text-slate-500 text-sm font-medium px-4">
                        {watchedDestination?.length > 0 
                          ? `Looking for the best spots in ${watchedDestination}...` 
                          : "Type a destination to see our top recommendations"}
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Travel Stats Card */}
            <div className="glass-card p-8 bg-indigo-600 shadow-[0_20px_40px_rgba(79,70,229,0.3)]">
              <h4 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                <Shield size={20} />
                Smart Planning
              </h4>
              <p className="text-indigo-100 text-sm leading-relaxed mb-6 opacity-90">
                Our algorithm calculates real-time traffic, average spend, and local transit schedules to ensure your trip stays within budget.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <p className="text-[10px] font-black text-indigo-200 uppercase mb-1">Success Rate</p>
                  <p className="text-xl font-black text-white">99.8%</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <p className="text-[10px] font-black text-indigo-200 uppercase mb-1">Local Tips</p>
                  <p className="text-xl font-black text-white">500+</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <AnimatePresence>
          {itinerary && budgetBreakdown && (
            <motion.div 
              ref={resultsRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-24 space-y-12"
            >
              {/* Results Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-5xl font-black mb-4">Your Custom <span className="text-gradient">Expedition</span></h2>
                <div className="flex flex-wrap justify-center gap-3">
                   <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-bold flex items-center gap-2">
                     <MapPin size={14} className="text-indigo-400" /> {tripData.destination}
                   </div>
                   <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-bold flex items-center gap-2">
                     <DollarSign size={14} className="text-emerald-400" /> ₱{tripData.budget.toLocaleString()}
                   </div>
                   <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-bold flex items-center gap-2">
                     <Calendar size={14} className="text-rose-400" /> {tripData.days} Days
                   </div>
                </div>
              </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Itinerary Text (Left) */}
                <div className="lg:col-span-7 space-y-8 order-2 lg:order-1">
                  <div className="glass-card p-6 sm:p-12 relative">
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-rose-500 rounded-l-[2rem]" />
                    <div className="prose prose-invert prose-slate max-w-none">
                      {itinerary.split('\n').map((line, idx) => {
                        if (line.startsWith('##')) {
                          return <h3 key={idx} className="text-2xl font-black text-white mt-10 first:mt-0 mb-6 flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-lg">
                              {line.match(/\d+/)?.[0] || '✨'}
                            </span>
                            {line.replace(/^#+\s/, '')}
                          </h3>;
                        }
                        if (line.startsWith('**')) {
                          return <p key={idx} className="font-black text-indigo-300 mt-6 mb-2 tracking-wide uppercase text-sm">{line.replace(/\*\*/g, '')}</p>;
                        }
                        if (line.trim().startsWith('-')) {
                          return <div key={idx} className="flex gap-3 mb-3 group">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-indigo-400 transition-colors shrink-0" />
                            <p className="text-slate-400 leading-relaxed text-base">{line.replace(/^-\s/, '')}</p>
                          </div>;
                        }
                        if (line.trim()) {
                          return <p key={idx} className="text-slate-400 mb-4 leading-relaxed">{line}</p>;
                        }
                        return null;
                      })}
                    </div>
                    
                    <div className="mt-12 flex flex-col sm:flex-row gap-4 pt-12 border-t border-white/5">
                      <button
                        onClick={handleSaveTrip}
                        disabled={saving}
                        className="premium-button flex-1"
                      >
                        {saving ? <Loader className="animate-spin" /> : <Save size={20} />}
                        {saveSuccess ? 'TRIP SAVED!' : 'SAVE THIS TRIP'}
                      </button>
                      <button
                        onClick={() => { setItinerary(null); setTripData(null); setStep(1); }}
                        className="px-8 py-4 rounded-full bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all text-center"
                      >
                        PLAN NEW ADVENTURE
                      </button>
                    </div>
                  </div>
                </div>

                 {/* Map & Budget (Right) */}
                <div className="lg:col-span-5 space-y-8 sticky top-24 order-1 lg:order-2">
                  {/* Budget Card */}
                  <div className="glass-card p-8">
                    <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                      <PieChart className="text-emerald-400" />
                      Spending Forecast
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20 group-hover:bg-orange-500/20 transition-all">
                          <UtensilsCrossed size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm font-bold mb-2">
                            <span className="text-slate-400">FOOD & DINING</span>
                            <span className="text-orange-400">₱{budgetBreakdown.food.toLocaleString()}</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: '40%' }} className="h-full bg-orange-500" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
                          <Car size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm font-bold mb-2">
                            <span className="text-slate-400">TRANSPORTATION</span>
                            <span className="text-blue-400">₱{budgetBreakdown.transport.toLocaleString()}</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: '30%' }} className="h-full bg-blue-500" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20 group-hover:bg-purple-500/20 transition-all">
                          <Ticket size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm font-bold mb-2">
                            <span className="text-slate-400">ACTIVITIES</span>
                            <span className="text-purple-400">₱{budgetBreakdown.activities.toLocaleString()}</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: '30%' }} className="h-full bg-purple-500" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {budgetBreakdown.budgetError && (
                      <div className="mt-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold leading-relaxed">
                        ⚠️ {budgetBreakdown.budgetError}
                      </div>
                    )}
                  </div>

                  {/* Map Card */}
                  <div className="glass-card overflow-hidden">
                    <div className="p-8 border-b border-white/5">
                      <h3 className="text-xl font-black flex items-center gap-3">
                        <Globe className="text-indigo-400" />
                        Dynamic Route
                      </h3>
                      {selectedPlace && (
                        <p className="mt-2 text-indigo-400 text-sm font-bold animate-pulse">📍 {selectedPlace.name}</p>
                      )}
                    </div>
                    <div className="h-[400px] relative bg-slate-900">
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        src={selectedPlace 
                          ? `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${userLocation ? `${userLocation.lat},${userLocation.lng}` : 'Manila'}&destination=${encodeURIComponent(selectedPlace.address || selectedPlace.name)}&mode=${travelMode === 'motorcycle' ? 'driving' : travelMode}`
                          : `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${userLocation ? `${userLocation.lat},${userLocation.lng}` : 'Manila'}&destination=${encodeURIComponent(tripData.destination + ', Philippines')}&mode=${travelMode === 'motorcycle' ? 'driving' : travelMode}`
                        }
                      />
                    </div>
                    <div className="p-6 bg-white/[0.02]">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedPlace?.name || tripData.destination)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-sm font-black text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        VIEW IN FULL MAPS <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
