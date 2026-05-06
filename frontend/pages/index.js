import Link from 'next/link';
import { MapPin, Zap, Users, ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiAzNGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTM2IDM0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
              <span className="text-xs sm:text-sm font-medium">AI-Powered Travel Planning</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              Explore Manila
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
                Like Never Before
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 mb-6 sm:mb-10 max-w-2xl mx-auto px-2">
              Create personalized travel itineraries in seconds with AI. Discover hidden gems, plan your budget, and explore Metro Manila smarter.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2">
              <Link
                href="/planner"
                className="w-full sm:w-auto group flex items-center justify-center sm:justify-start space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 active:scale-95 sm:hover:scale-105 shadow-lg hover:shadow-orange-500/50"
              >
                <span>Start Planning</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform hidden sm:inline" />
              </Link>
              
              <Link
                href="/explore"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 border border-white/30 active:scale-95"
              >
                <span>Explore</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">MNLXPLORE</span>?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Everything you need to plan the perfect trip to Metro Manila
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="group bg-white p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 active:scale-95 sm:hover:-translate-y-2">
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-md">
              <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">AI Itinerary Generator</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Get personalized travel plans in seconds based on your preferences, budget, and schedule.</p>
          </div>
          
          <div className="group bg-white p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 active:scale-95 sm:hover:-translate-y-2">
            <div className="bg-gradient-to-br from-blue-400 to-indigo-600 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-md">
              <MapPin className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">Smart Route Planning</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Optimize your travel routes and discover hidden gems across Metro Manila.</p>
          </div>
          
          <div className="group bg-white p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 active:scale-95 sm:hover:-translate-y-2 sm:col-span-2 lg:col-span-1">
            <div className="bg-gradient-to-br from-purple-400 to-purple-600 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-md">
              <Users className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">Local Support</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Connect with local businesses and support tourism in your community.</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">How It Works</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-2">Three simple steps to your perfect trip</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            <div className="text-center px-2">
              <div className="relative inline-block mb-4 sm:mb-6">
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto text-2xl sm:text-3xl font-bold shadow-lg">
                  1
                </div>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">Enter Trip Details</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Tell us your destination, budget, dates, and travel preferences.</p>
            </div>
            
            <div className="text-center px-2">
              <div className="relative inline-block mb-4 sm:mb-6">
                <div className="bg-gradient-to-br from-blue-400 to-indigo-600 text-white rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto text-2xl sm:text-3xl font-bold shadow-lg">
                  2
                </div>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">AI Generates Plan</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Our AI creates a personalized itinerary tailored just for you.</p>
            </div>
            
            <div className="text-center px-2 sm:col-span-2 lg:col-span-1">
              <div className="relative inline-block mb-4 sm:mb-6">
                <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto text-2xl sm:text-3xl font-bold shadow-lg">
                  3
                </div>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">Travel Smart</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">Save, share, and follow your personalized travel guide.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
