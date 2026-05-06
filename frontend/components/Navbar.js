import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Home, Compass, Map, LayoutDashboard, LogOut, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
    router.push('/');
  };

  const isActive = (path) => router.pathname === path;

  const navLinks = [
    { href: '/', label: 'Home', icon: Home, public: true },
    { href: '/explore', label: 'Explore', icon: Compass, public: true },
    { href: '/planner', label: 'Planner', icon: Map, public: true },
    { href: '/dashboard', label: 'My Trips', icon: LayoutDashboard, protected: true },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'py-2 px-2 sm:px-8' 
        : 'py-4 px-2 sm:px-8'
    }`}>
      <div className={`max-w-7xl mx-auto transition-all duration-500 rounded-[1.5rem] sm:rounded-[2rem] px-4 sm:px-6 ${
        scrolled 
          ? 'bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl' 
          : 'bg-transparent'
      }`}>
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-2xl group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-indigo-500/20">
              <Map className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-white tracking-tighter">
              MNL<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">XPLORE</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.protected && !isLoggedIn) return null;
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center space-x-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    active
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-full"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 ${active ? 'text-indigo-400' : ''}`} />
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center gap-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-slate-400 hover:text-white text-sm font-bold px-4 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Free</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-3 rounded-2xl bg-white/5 border border-white/10 text-white transition-all active:scale-90"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl p-8 z-[60] flex flex-col"
          >
             <div className="flex justify-between items-center mb-12">
                <span className="text-xl font-black tracking-tighter">MNL<span className="text-indigo-400">XPLORE</span></span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-2xl bg-white/5 text-white">
                  <X size={24} />
                </button>
             </div>
             <div className="relative space-y-4 flex-1">
                {navLinks.map((link) => {
                  if (link.protected && !isLoggedIn) return null;
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all ${
                        active
                          ? 'bg-indigo-500/10 text-white border border-indigo-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${active ? 'text-indigo-400' : ''}`} />
                      <span className="text-lg font-black">{link.label}</span>
                    </Link>
                  );
                })}
                
                <div className="pt-6 mt-4 border-t border-white/5 space-y-4">
                  {isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold"
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center justify-center px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold"
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20"
                      >
                        <Sparkles size={20} />
                        <span>Get Started</span>
                      </Link>
                    </>
                  )}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
