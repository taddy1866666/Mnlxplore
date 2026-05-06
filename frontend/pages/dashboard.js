import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '../utils/api';
import { Loader, Trash2, Calendar, DollarSign, MapPin as MapPinIcon, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
        setError('Failed to load trips');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tripId) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await apiClient.delete(`/api/trips/${tripId}`);
      setTrips(trips.filter(t => t._id !== tripId));
    } catch (err) {
      setError('Failed to delete trip');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dashboard</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600">Manage and view your saved trips</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-xl mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 sm:h-64 bg-white rounded-2xl shadow-lg">
            <Loader className="animate-spin text-blue-600 mb-3 sm:mb-4 w-8 h-8 sm:w-12 sm:h-12" />
            <p className="text-gray-600 text-base sm:text-lg">Loading your trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <MapPinIcon className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No trips yet!</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">Start planning your first adventure in Metro Manila</p>
            <Link
              href="/planner"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 active:scale-95 sm:hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              <span>Plan Your First Trip</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {trips.map((trip) => (
              <div
                key={trip._id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 active:scale-95 sm:hover:-translate-y-1"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 sm:p-6 text-white">
                  <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2 line-clamp-2">{trip.destination}</h3>
                  <span className="inline-block bg-white/20 backdrop-blur-sm px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                    {trip.status || 'Completed'}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <div className="bg-orange-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                      <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500">Budget</p>
                      <p className="font-semibold text-sm sm:text-base truncate">₱{trip.budget?.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-700">
                    <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Duration</p>
                      <p className="font-semibold text-sm sm:text-base">{trip.days} {trip.days === 1 ? 'day' : 'days'}</p>
                    </div>
                  </div>

                  <div className="pt-3 sm:pt-4 border-t border-gray-100">
                    <p className="text-xs sm:text-sm text-gray-500">Created on</p>
                    <p className="font-medium text-gray-700 text-xs sm:text-sm">{new Date(trip.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex gap-2 sm:gap-3">
                  <button className="flex-1 flex items-center justify-center space-x-1 sm:space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 sm:hover:scale-105 text-xs sm:text-sm">
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleDelete(trip._id)}
                    className="px-2.5 sm:px-4 py-2 sm:py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-200 active:scale-95 sm:hover:scale-105"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
