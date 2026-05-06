import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Home, Compass, Map, LayoutDashboard, LogOut, LogIn, UserPlus, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
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
    { href: '/planner', label: 'Plan Trip', icon: Map, public: true },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, protected: true },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-orange-500 p-2 rounded-lg group-hover:bg-orange-600 transition-all duration-300 transform group-hover:scale-110">
              <Map className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              MNL<span className="text-orange-400">XPLORE</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              if (link.protected && !isLoggedIn) return null;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(link.href)
                      ? 'bg-white/20 text-white font-semibold'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center space-x-2 text-blue-100 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-800 border-t border-blue-600">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              if (link.protected && !isLoggedIn) return null;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(link.href)
                      ? 'bg-white/20 text-white font-semibold'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-3 mt-3 border-t border-blue-600 space-y-2">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white transition-all duration-200"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all duration-200"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
