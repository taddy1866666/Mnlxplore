import { useState } from 'react';
import axios from 'axios';
import { Loader, Sparkles, MapPin, DollarSign, Calendar, Heart, Coffee, Utensils, Landmark, Mountain, Moon, Navigation, Star, Clock, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdvancedPlanner() {
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [travelMode, setTravelMode] = useState('walking');
  const [recommendations, setRecommendations] = useState(null);
  const [themedPlan, setThemedPlan] = useState(null);
  const [error, setError] = useState('');

  const themes = [
    { id: 'romantic', name: 'Romantic Date', icon: Heart, color: 'from-pink-500 to-red-500', desc: 'Perfect for couples' },
    { id: 'food', name: 'Food Trip', icon: Utensils, color: 'from-orange-500 to-yellow-500', desc: 'Culinary adventure' },
    { id: 'cafe', name: 'Café Hopping', icon: Coffee, color: 'from-amber-500 to-orange-500', desc: 'Coffee lovers' },
    { id: 'cultural', name: 'Cultural Tour', icon: Landmark, color: 'from-purple-500 to-indigo-500', desc: 'History & art' },
    { id: 'adventure', name: 'Adventure', icon: Mountain, color: 'from-green-500 to-teal-500', desc: 'Thrill seekers' },
    { id: 'nightlife', name: 'Nightlife', icon: Moon, color: 'from-indigo-500 to-purple-500', desc: 'Evening fun' }
  ];

  const travelModes = [
    { id: 'walking', name: 'Walking', icon: '🚶', time: 'Slowest' },
    { id: 'driving', name: 'Driving', icon: '🚗', time: 'Fastest' },
    { id: 'transit', name: 'Transit', icon: '🚌', time: 'Moderate' }
  ];

  const handleGetRecommendations = async () => {
    if (!destination || !budget) {
      setError('Please enter destination and budget');
      return;
    }

    setLoading(true);
    setError('');
    setRecommendations(null);

    try {
      const response = await axios.post(`${API_URL}/api/places/recommendations`, {
        destination,
        preferences: selectedTheme ? [selectedTheme] : ['tourist_attraction'],
        budget: parseFloat(budget),
        travelMode
      });

      setRecommendations(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateThemedPlan = async () => {
    if (!destination || !budget || !selectedTheme) {
      setError('Please select destination, budget, and theme');
      return;
    }

    setLoading(true);
    setError('');
    setThemedPlan(null);

    try {
      const response = await axios.post(`${API_URL}/api/places/themed-plan`, {
        destination,
        theme: selectedTheme,
        budget: parseFloat(budget),
        duration: 1
      });

      setThemedPlan(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating themed plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-700">Advanced AI Planning</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Travel Planner</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get AI-powered recommendations with distance, travel time, and themed itineraries
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="flex items-center space-x-2 text-gray-700 font-semibold mb-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>Destination</span>
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., BGC, Makati, Intramuros"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-gray-700 font-semibold mb-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>Budget (PHP)</span>
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g., 3000"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Travel Mode Selection */}
          <div className="mb-6">
            <label className="flex items-center space-x-2 text-gray-700 font-semibold mb-3">
              <Navigation className="w-5 h-5 text-indigo-600" />
              <span>Travel Mode</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              {travelModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setTravelMode(mode.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    travelMode === mode.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{mode.icon}</div>
                  <div className="font-semibold text-gray-900">{mode.name}</div>
                  <div className="text-sm text-gray-500">{mode.time}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selection */}
          <div className="mb-6">
            <label className="flex items-center space-x-2 text-gray-700 font-semibold mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>Select Theme</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {themes.map((theme) => {
                const Icon = theme.icon;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedTheme === theme.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${theme.color} flex items-center justify-center mx-auto mb-2`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-semibold text-gray-900">{theme.name}</div>
                    <div className="text-xs text-gray-500">{theme.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleGetRecommendations}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <MapPin size={20} />
                  <span>Get Smart Recommendations</span>
                </>
              )}
            </button>

            <button
              onClick={handleGenerateThemedPlan}
              disabled={loading || !selectedTheme}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>Generate Themed Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Recommendations Results */}
        {recommendations && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-600 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Smart Recommendations</h2>
                <p className="text-gray-600">{recommendations.count} places found near {recommendations.destination}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.places.map((place, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200 hover:border-blue-400 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-gray-900">{place.name}</h3>
                    {place.rating !== 'N/A' && (
                      <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-600 fill-current" />
                        <span className="text-sm font-semibold text-yellow-700">{place.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{place.address}</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {place.distance && (
                      <div className="flex items-center space-x-2 bg-blue-50 p-2 rounded-lg">
                        <Navigation className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-700">{place.distance}</span>
                      </div>
                    )}
                    {place.duration && (
                      <div className="flex items-center space-x-2 bg-green-50 p-2 rounded-lg">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-700">{place.duration}</span>
                      </div>
                    )}
                  </div>

                  {place.priceLevel > 0 && (
                    <div className="mt-3 text-sm text-gray-600">
                      Price Level: {'₱'.repeat(place.priceLevel)}
                    </div>
                  )}

                  {place.isOpen !== undefined && (
                    <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      place.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {place.isOpen ? 'Open Now' : 'Closed'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Themed Plan Results */}
        {themedPlan && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-purple-400 to-pink-600 p-3 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your {themedPlan.theme} Plan</h2>
                <p className="text-gray-600">Budget: ₱{themedPlan.budget.toLocaleString()}</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
                {themedPlan.itinerary}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
