import Link from 'next/link';
import { Map, Mail, Github, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Map className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                MNL<span className="text-orange-400">XPLORE</span>
              </span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Your AI-powered travel companion for exploring Metro Manila. Plan smarter trips with personalized itineraries and local insights.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/planner" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Plan Trip
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-orange-400 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>support@mnlxplore.com</span>
              </li>
              <li className="text-gray-400">Metro Manila, Philippines</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} MNLXPLORE. All rights reserved.</p>
          <p className="mt-2">Made with ❤️ for travelers in Metro Manila</p>
        </div>
      </div>
    </footer>
  );
}
