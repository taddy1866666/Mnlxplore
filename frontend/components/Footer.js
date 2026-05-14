import Link from 'next/link';
import { Map, Mail, Github, Twitter, Facebook, Heart, Navigation, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 pt-24 pb-12 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 mb-16">
          {/* Brand & Mission */}
          <div className="md:col-span-6 space-y-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 overflow-hidden rounded-2xl shadow-lg shadow-indigo-500/20">
                <img src="/images/mnlxplore-logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-3xl font-black text-white tracking-tighter">
                MNL<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">XPLORE</span>
              </span>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Democratizing travel planning in Metro Manila through smart technology. We help you find the soul of the city, one itinerary at a time.
            </p>
            {/* Social links removed as requested */}
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-3">
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8">Navigation</h3>
            <ul className="space-y-4">
              {[
                { label: 'Home', href: '/' },
                { label: 'Explore', href: '/explore' },
                { label: 'Trip Planner', href: '/planner' },
                { label: 'My Dashboard', href: '/dashboard' }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-400 hover:text-white transition-colors text-base font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="md:col-span-3">
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8">Get in Touch</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-indigo-400 mt-0.5" />
                <div>
                  <p className="text-white font-bold text-sm">Email Support</p>
                  <p className="text-slate-400 text-sm">christianlanzaderas7@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-rose-400 mt-0.5" />
                <div>
                  <p className="text-white font-bold text-sm">Based In</p>
                  <p className="text-slate-400 text-sm">Metro Manila, PH</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} MNLXPLORE. Built for the modern traveler.
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            Made with <Heart size={14} className="text-rose-500 fill-rose-500" /> in the Philippines
          </div>
        </div>
      </div>
    </footer>
  );
}
