import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import apiClient from '../utils/api';
import { Loader, Sparkles, MapPin, DollarSign, Calendar, Heart, Save, PieChart, UtensilsCrossed, Car, Ticket, Navigation, Clock, TrendingUp, Coffee, Utensils, Landmark, Mountain, Moon, Star, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getCuratedPlaces } from '../utils/curatedPlaces';

export default function Planner() {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [error, setError] = useState('');
  const [tripData, setTripData] = useState(null);
  const [budgetBreakdown, setBudgetBreakdown] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [travelMode, setTravelMode] = useState('walking');
  const [recommendations, setRecommendations] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [travelInfo, setTravelInfo] = useState(null);
  const [curatedPlaces, setCuratedPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeTravelInfo, setPlaceTravelInfo] = useState(null);
  const [loadingPlaceInfo, setLoadingPlaceInfo] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const popularDestinations = [
    { name: 'BGC, Taguig', icon: '🏙️', desc: 'Modern business district' },
    { name: 'Makati', icon: '🏢', desc: 'Shopping & dining hub' },
    { name: 'Intramuros, Manila', icon: '🏰', desc: 'Historic walled city' },
    { name: 'Quezon City', icon: '🎭', desc: 'Entertainment & culture' },
    { name: 'Poblacion, Makati', icon: '🍻', desc: 'Nightlife district' },
    { name: 'Ortigas Center', icon: '🏬', desc: 'Business & shopping' }
  ];

  const themePreferences = [
    { id: 'romantic', name: 'Romantic', icon: Heart, color: 'from-pink-500 to-red-500' },
    { id: 'food', name: 'Food Trip', icon: Utensils, color: 'from-orange-500 to-yellow-500' },
    { id: 'cafe', name: 'Café Hopping', icon: Coffee, color: 'from-amber-500 to-orange-500' },
    { id: 'cultural', name: 'Cultural', icon: Landmark, color: 'from-purple-500 to-indigo-500' },
    { id: 'shopping', name: 'Malls & Shopping', icon: Mountain, color: 'from-green-500 to-teal-500' },
    { id: 'nightlife', name: 'Nightlife', icon: Moon, color: 'from-indigo-500 to-purple-500' }
  ];

  const travelModes = [
    { id: 'walking', name: 'Walking', icon: '🚶', desc: 'Best for nearby (₱0)' },
    { id: 'motorcycle', name: 'Motorcycle', icon: '🛵', desc: 'Fast & Cheap (~50km/L)' },
    { id: 'driving', name: 'Driving', icon: '🚗', desc: 'Fastest (~10km/L)' },
    { id: 'transit', name: 'Transit', icon: '🚌', desc: 'LRT/MRT/Carousel' }
  ];

  const calculateBudgetBreakdown = (budget, distanceKm = 0, mode = 'walking', days = 1) => {
    let dailyTransport = 0;
    const GAS_PRICE = 70; // 2025 Metro Manila average
    
    if (mode === 'driving') {
      // Round trip gas (10km/L) + ₱150 daily parking
      dailyTransport = ((distanceKm / 10) * GAS_PRICE * 2) + 150;
    } else if (mode === 'motorcycle') {
      // Round trip gas (50km/L) + ₱150 daily parking
      dailyTransport = ((distanceKm / 50) * GAS_PRICE * 2) + 150;
    } else if (mode === 'transit') {
      // ₱20 base (transfer buffer) + ₱2/km + ₱120 daily connecting rides (jeep/trike)
      const oneWay = 20 + (distanceKm * 2);
      dailyTransport = (oneWay * 2) + 120;
    } else if (mode === 'walking') {
      dailyTransport = 0;
    }

    let transport = Math.round(dailyTransport * days);
    let error = null;

    if (transport > budget) {
      error = "Insufficient budget for transportation. Consider increasing your budget or choosing a cheaper travel mode.";
    } else if (transport > budget * 0.7) {
      error = "Warning: Transport takes up more than 70% of your budget. You might not have enough for food and activities.";
    }

    const remainingBudget = Math.max(0, budget - transport);
    const food = Math.round(remainingBudget * 0.6);
    const activities = Math.round(remainingBudget * 0.4);
    
    return { food, transport, activities, budgetError: error };
  };

  const getPriceRange = (level) => {
    switch (level) {
      case 0: return 'Free';
      case 1: return '₱150 - ₱300';
      case 2: return '₱400 - ₱800';
      case 3: return '₱1,000 - ₱2,500';
      case 4: return '₱3,000+';
      default: return '₱300 - ₱600';
    }
  };

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(loc);
            setLocationError('');
            resolve(loc);
          },
          (error) => {
            console.error('Geolocation error:', error);
            setLocationError('Unable to get your location');
            const defaultLoc = { lat: 14.5995, lng: 120.9842 }; // Manila
            setUserLocation(defaultLoc);
            resolve(defaultLoc);
          },
          { timeout: 10000 }
        );
      } else {
        setLocationError('Geolocation not supported');
        const defaultLoc = { lat: 14.5995, lng: 120.9842 };
        setUserLocation(defaultLoc);
        resolve(defaultLoc);
      }
    });
  };

  const watchedDestination = watch('destination');

  // Standalone fetch function - can be called directly from theme click or via useEffect
  const fetchSuggestions = async (dest, theme) => {
    if (!dest || dest.length < 3) return;
    setLoadingSuggestions(true);
    setCuratedPlaces([]);
    try {
      const response = await apiClient.post(`/api/places/curated`, {
        destination: dest,
        theme: theme
      });
      if (response.data && response.data.places) {
        setCuratedPlaces(response.data.places);
      }
    } catch (err) {
      console.error('Suggestion fetch error:', err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Debounced fetch when destination changes (user typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(watchedDestination, selectedTheme);
    }, 800);
    return () => clearTimeout(timer);
  }, [watchedDestination]);

  const calculateTravelInfo = async (destination) => {
    if (!userLocation) return;

    try {
      const response = await apiClient.post(`/api/places/calculate-distance`, {
        origin: `${userLocation.lat},${userLocation.lng}`,
        destination: destination,
        travelMode: travelMode === 'motorcycle' ? 'driving' : travelMode
      });
      setTravelInfo(response.data);
    } catch (err) {
      console.error('Error calculating travel info:', err);
    }
  };

  const handlePlaceClick = async (place) => {
    setSelectedPlace(place);
    setLoadingPlaceInfo(true);
    
    if (!userLocation) {
      getUserLocation();
      setTimeout(() => calculatePlaceTravelInfo(place), 1000);
    } else {
      await calculatePlaceTravelInfo(place);
    }
  };

  const calculatePlaceTravelInfo = async (place) => {
    if (!userLocation) return;

    try {
      const response = await apiClient.post(`/api/places/calculate-distance`, {
        origin: `${userLocation.lat},${userLocation.lng}`,
        destination: place.address || place.name,
        travelMode: travelMode === 'motorcycle' ? 'driving' : travelMode
      });
      
      const now = new Date();
      const travelMinutes = parseInt(response.data.duration.match(/\d+/)?.[0] || 0);
      const arrivalTime = new Date(now.getTime() + travelMinutes * 60000);
      
      setPlaceTravelInfo({
        ...response.data,
        arrivalTime: arrivalTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        travelMinutes
      });
    } catch (err) {
      console.error('Error calculating place travel info:', err);
    } finally {
      setLoadingPlaceInfo(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setItinerary(null);
    setSaveSuccess(false);
    setRecommendations(null);
    setTravelInfo(null);

    let currentLoc = userLocation;
    if (!currentLoc) {
      currentLoc = await getUserLocation();
    }

    const tripInfo = {
      destination: data.destination,
      budget: parseFloat(data.budget),
      days: parseInt(data.dates),
      preferences: selectedTheme ? [selectedTheme] : (data.preferences ? data.preferences.split(',').map(p => p.trim()) : []),
      travelMode
    };

    setTripData(tripInfo);
    setBudgetBreakdown(calculateBudgetBreakdown(tripInfo.budget, 0, travelMode, tripInfo.days));
    
    // Curated places are already being fetched by the effect or handled below
    if (curatedPlaces.length === 0) {
      try {
        const curatedResponse = await apiClient.post(`/api/places/curated`, {
          destination: tripInfo.destination,
          theme: selectedTheme
        });
        setCuratedPlaces(curatedResponse.data.places);
      } catch (err) {
        console.error('Error fetching curated places:', err);
      }
    }

    try {
      // Calculate travel info from user location to destination
      let distanceKm = 5; // Default fallback distance (5km)
      
      try {
        if (currentLoc) {
          const distResponse = await apiClient.post(`/api/places/calculate-distance`, {
            origin: `${currentLoc.lat},${currentLoc.lng}`,
            destination: tripInfo.destination,
            travelMode: travelMode === 'motorcycle' ? 'driving' : travelMode
          });
          setTravelInfo(distResponse.data);
          distanceKm = (distResponse.data.distanceValue || 5000) / 1000;
        }
      } catch (distErr) {
        console.error('Distance matrix error:', distErr);
        // Fallback info if API fails
        setTravelInfo({
          distance: 'Estimated 5-10 km',
          duration: 'Estimated 30 mins',
          travelMode
        });
      }

      // Update budget with accurate transport cost (round trip + daily parking/extras)
      setBudgetBreakdown(calculateBudgetBreakdown(tripInfo.budget, distanceKm, travelMode, tripInfo.days));

      const recsResponse = await apiClient.post(`/api/places/recommendations`, {
        destination: tripInfo.destination,
        preferences: tripInfo.preferences,
        budget: tripInfo.budget,
        travelMode: tripInfo.travelMode === 'motorcycle' ? 'driving' : tripInfo.travelMode
      });
      setRecommendations(recsResponse.data);

      const itineraryResponse = await apiClient.post(`/api/trip/generate`, {
        ...tripInfo,
        suggestedPlaces: curatedPlaces
      });
      setItinerary(itineraryResponse.data.itinerary);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating itinerary');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to save trips');
      window.location.href = '/login';
      return;
    }

    setSaving(true);
    try {
      await apiClient.post(
        `/api/trips/save`,
        { ...tripData, itinerary }
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save trip');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-pink-100 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold text-orange-700">AI-Powered Smart Planning</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Plan Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Perfect Trip</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get AI recommendations with distance, travel time, and personalized itineraries
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Step 1: Destination */}
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm">1</div>
                <label className="text-lg font-bold text-gray-800">Where do you want to go?</label>
              </div>
              <input
                {...register('destination', { required: 'Destination is required' })}
                type="text"
                placeholder="e.g., BGC, Makati, Intramuros..."
                onFocus={() => setShowSuggestions(true)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-lg"
              />
              {errors.destination && <p className="text-red-500 text-sm mt-2">{errors.destination.message}</p>}

              {showSuggestions && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {popularDestinations.map((dest) => (
                    <button
                      key={dest.name}
                      type="button"
                      onClick={() => {
                        setValue('destination', dest.name);
                        setShowSuggestions(false);
                        fetchSuggestions(dest.name, selectedTheme);
                      }}
                      className="flex items-center space-x-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-all text-left"
                    >
                      <span className="text-xl">{dest.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{dest.name}</p>
                        <p className="text-xs text-gray-500">{dest.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Budget + Days */}
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-black text-sm">2</div>
                <label className="text-lg font-bold text-gray-800">Budget & Duration</label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center space-x-2 text-gray-600 font-semibold mb-2 text-sm uppercase tracking-wide">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span>Total Budget (PHP)</span>
                  </label>
                  <input
                    {...register('budget', {
                      required: 'Budget is required',
                      min: { value: 100, message: 'Minimum budget is ₱100' },
                      max: { value: 1000000, message: 'Maximum budget is ₱1,000,000' }
                    })}
                    type="number"
                    placeholder="e.g., 5000"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                  />
                  {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>}
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-gray-600 font-semibold mb-2 text-sm uppercase tracking-wide">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>Number of Days</span>
                  </label>
                  <input
                    {...register('dates', {
                      required: 'Number of days is required',
                      min: { value: 1, message: 'Minimum 1 day' },
                      max: { value: 30, message: 'Maximum 30 days' }
                    })}
                    type="number"
                    placeholder="e.g., 3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  {errors.dates && <p className="text-red-500 text-sm mt-1">{errors.dates.message}</p>}
                </div>
              </div>
            </div>

            {/* Step 3: Travel Theme */}
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-black text-sm">3</div>
                <label className="text-lg font-bold text-gray-800">Choose your Travel Theme</label>
              </div>
              <p className="text-sm text-gray-500 mb-4">Pick a theme and we'll instantly suggest nearby places that match!</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {themePreferences.map((theme) => {
                  const Icon = theme.icon;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => {
                        const newTheme = theme.id === selectedTheme ? '' : theme.id;
                        setSelectedTheme(newTheme);
                        fetchSuggestions(watchedDestination, newTheme);
                      }}
                      className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all text-left ${
                        selectedTheme === theme.id
                          ? `border-transparent bg-gradient-to-r ${theme.color} text-white shadow-lg`
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        selectedTheme === theme.id ? 'bg-white/20' : `bg-gradient-to-r ${theme.color}`
                      }`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${selectedTheme === theme.id ? 'text-white' : 'text-gray-800'}`}>{theme.name}</div>
                        {selectedTheme === theme.id && (
                          <div className="text-[10px] text-white/80 font-medium">Selected ✓</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Inline Suggested Places (appears right after theme selection) */}
              {curatedPlaces && curatedPlaces.length > 0 && selectedTheme && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Suggested {themePreferences.find(t => t.id === selectedTheme)?.name} Places
                      </h3>
                      <p className="text-sm text-gray-500">Near {watchedDestination} · {curatedPlaces.length} spots found</p>
                    </div>
                    <div className="bg-orange-100 px-3 py-1.5 rounded-full">
                      <span className="text-orange-700 text-sm font-bold">{curatedPlaces.length} Places</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {curatedPlaces.map((place, index) => (
                      <div
                        key={index}
                        onClick={() => handlePlaceClick(place)}
                        className={`group bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:shadow-xl cursor-pointer ${
                          selectedPlace?.placeId === place.placeId
                            ? 'border-orange-500 ring-4 ring-orange-100'
                            : 'border-gray-100 hover:border-orange-300'
                        }`}
                      >
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={place.image}
                            alt={place.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                            <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow text-xs font-bold text-orange-600">
                              {getPriceRange(place.priceLevel)}
                            </div>
                            {place.isGem ? (
                              <div className="bg-purple-600/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-white" />
                                <span className="text-[9px] font-bold text-white uppercase">Hidden Gem</span>
                              </div>
                            ) : (
                              <div className="bg-blue-600/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-white" />
                                <span className="text-[9px] font-bold text-white uppercase">Popular</span>
                              </div>
                            )}
                          </div>
                          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs font-bold text-gray-900">{place.rating || 'N/A'}</span>
                          </div>
                          {place.isOpen !== undefined && (
                            <div className={`absolute bottom-2 right-2 px-2.5 py-1 rounded-full text-[9px] font-bold ${
                              place.isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            }`}>
                              {place.isOpen ? 'OPEN' : 'CLOSED'}
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <h4 className="font-bold text-base text-gray-900 mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">{place.name}</h4>
                          <div className="flex items-start space-x-1 text-xs text-gray-500 mb-3">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{place.address}</span>
                          </div>

                          {/* Locate Info */}
                          {selectedPlace?.placeId === place.placeId && (
                            <div className="mb-3 p-2.5 bg-orange-50 rounded-xl border border-orange-100">
                              {loadingPlaceInfo ? (
                                <div className="flex items-center justify-center space-x-2 py-1">
                                  <Loader className="w-4 h-4 text-orange-600 animate-spin" />
                                  <span className="text-xs font-bold text-orange-700">Locating...</span>
                                </div>
                              ) : placeTravelInfo ? (
                                <div className="grid grid-cols-2 gap-2 text-center">
                                  <div>
                                    <p className="text-[9px] text-gray-400 uppercase font-bold">Distance</p>
                                    <p className="text-sm font-black text-blue-600">{placeTravelInfo.distance}</p>
                                  </div>
                                  <div>
                                    <p className="text-[9px] text-gray-400 uppercase font-bold">ETA</p>
                                    <p className="text-sm font-black text-green-600">{placeTravelInfo.arrivalTime}</p>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); handlePlaceClick(place); }}
                              className={`flex-1 py-2 rounded-lg font-bold text-xs flex items-center justify-center space-x-1.5 transition-all ${
                                selectedPlace?.placeId === place.placeId
                                  ? 'bg-orange-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-orange-600 hover:text-white'
                              }`}
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              <span>{selectedPlace?.placeId === place.placeId ? 'Located' : 'Locate'}</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.address)}`, '_blank');
                              }}
                              className="w-10 h-8 flex items-center justify-center bg-gray-100 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded-lg transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading state for suggestions */}
              {loadingSuggestions && selectedTheme && (
                <div className="mt-6 flex items-center justify-center space-x-3 py-6 text-gray-400">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">Finding nearby {themePreferences.find(t => t.id === selectedTheme)?.name} places...</span>
                </div>
              )}
            </div>

            {/* Step 4: Travel Mode + Generate */}
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-sm">4</div>
                <label className="text-lg font-bold text-gray-800">Travel Mode</label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {travelModes.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setTravelMode(mode.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      travelMode === mode.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="text-3xl mb-1">{mode.icon}</div>
                    <div className="font-semibold text-gray-900 text-sm">{mode.name}</div>
                    <div className="text-xs text-gray-500">{mode.desc}</div>
                  </button>
                ))}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-4 rounded-xl text-lg uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-3"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin w-5 h-5" />
                    <span>Planning...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Full Itinerary</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 mb-8 animate-fade-in">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 border-8 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-600 w-10 h-10" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AI is crafting your perfect itinerary...</h3>
                <p className="text-gray-600">Analyzing destinations, calculating distances, and finding best places</p>
              </div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}


        {itinerary && budgetBreakdown && (
          <div className="space-y-6">
            
            {/* Recommended Places */}
            {recommendations && recommendations.places && recommendations.places.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-fade-in">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-400 to-indigo-600 p-3 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Recommended Places</h2>
                    <p className="text-gray-600">
                      {recommendations.count} places found • Travel mode: {travelMode === 'walking' ? 'Walking 🚶' : travelMode === 'driving' ? 'Driving 🚗' : 'Transit 🚌'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.places.slice(0, 6).map((place, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border-2 border-gray-200 hover:border-blue-400 transition-all hover:shadow-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-base text-gray-900 flex-1">{place.name}</h3>
                        {place.rating !== 'N/A' && (
                          <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-1 rounded-lg ml-2">
                            <Star className="w-4 h-4 text-yellow-600 fill-current" />
                            <span className="text-sm font-semibold text-yellow-700">{place.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-1">{place.address}</p>
                      
                      <div className="flex gap-2 flex-wrap">
                        {place.distance && place.distance !== 'N/A' && (
                          <div className="flex items-center space-x-1 bg-blue-50 px-3 py-1.5 rounded-lg">
                            <Navigation className="w-3 h-3 text-blue-600" />
                            <span className="text-xs font-semibold text-blue-700">{place.distance}</span>
                          </div>
                        )}
                        {place.duration && place.duration !== 'N/A' && (
                          <div className="flex items-center space-x-1 bg-green-50 px-3 py-1.5 rounded-lg">
                            <Clock className="w-3 h-3 text-green-600" />
                            <span className="text-xs font-semibold text-green-700">{place.duration}</span>
                          </div>
                        )}
                        {place.priceLevel > 0 && (
                          <div className="bg-orange-50 px-3 py-1.5 rounded-lg">
                            <span className="text-xs font-semibold text-orange-700">{'₱'.repeat(place.priceLevel)}</span>
                          </div>
                        )}
                        {place.isOpen !== undefined && (
                          <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            place.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {place.isOpen ? 'Open' : 'Closed'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {recommendations.places.length > 6 && (
                  <div className="mt-4 text-center text-sm text-gray-500">
                    Showing top 6 of {recommendations.count} places
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-fade-in">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-xl">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Budget Breakdown</h2>
                  <p className="text-gray-600">How your ₱{tripData?.budget?.toLocaleString()} will be spent</p>
                </div>
              </div>

              {budgetBreakdown.budgetError && (
                <div className={`mb-6 p-4 rounded-xl flex items-start space-x-3 border-2 ${
                  budgetBreakdown.budgetError.includes('Warning') 
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <div className="mt-0.5">⚠️</div>
                  <p className="text-sm font-semibold">{budgetBreakdown.budgetError}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-2 border-orange-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-orange-500 p-2 rounded-lg">
                      <UtensilsCrossed className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900">Food</h3>
                  </div>
                  <p className="text-3xl font-bold text-orange-600">₱{budgetBreakdown.food.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">40% of budget</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <Car className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900">Transport</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">₱{budgetBreakdown.transport.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">30% of budget</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-purple-500 p-2 rounded-lg">
                      <Ticket className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900">Activities</h3>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">₱{budgetBreakdown.activities.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">30% of budget</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-red-400 to-red-600 p-3 rounded-xl">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Location Map</h2>
                    {selectedPlace && (
                      <p className="text-sm text-purple-600 font-semibold">📍 {selectedPlace.name}</p>
                    )}
                  </div>
                </div>
                {selectedPlace && (
                  <button
                    onClick={() => {
                      setSelectedPlace(null);
                      setPlaceTravelInfo(null);
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all text-sm"
                  >
                    Reset Map
                  </button>
                )}
              </div>

              {/* Place Travel Info Card */}
              {selectedPlace && placeTravelInfo && (
                <div className="mb-6 bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200 animate-fade-in">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-purple-600 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Travel to {selectedPlace.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <Navigation className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-gray-600">Distance</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">{placeTravelInfo.distance}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-semibold text-gray-600">Travel Time</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-600">{placeTravelInfo.duration}</p>
                      <p className="text-xs text-gray-500 mt-1">via {travelMode === 'walking' ? 'Walking 🚶' : travelMode === 'driving' ? 'Driving 🚗' : 'Transit 🚌'}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-600">Arrival Time</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{placeTravelInfo.arrivalTime}</p>
                      <p className="text-xs text-gray-500 mt-1">Estimated</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-semibold text-gray-600">Rating</span>
                      </div>
                      <p className="text-2xl font-bold text-yellow-600">{selectedPlace.rating}</p>
                      <p className="text-xs text-gray-500 mt-1">{selectedPlace.userRatingsTotal?.toLocaleString()} reviews</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="inline-block w-3 h-3 bg-blue-600 rounded-full"></span>
                      <span>Your Location</span>
                      <span className="mx-2">→</span>
                      <span className="inline-block w-3 h-3 bg-purple-600 rounded-full"></span>
                      <span>{selectedPlace.name}</span>
                    </div>
                    {selectedPlace.isOpen !== undefined && (
                      <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        selectedPlace.isOpen 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {selectedPlace.isOpen ? '✓ OPEN NOW' : '✗ CLOSED'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Destination Travel Info Card */}
              {!selectedPlace && travelInfo && (
                <div className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <Navigation className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Your Travel Info</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-600">Your Location</span>
                      </div>
                      <p className="text-base font-bold text-gray-900">{travelInfo.origin || 'Current Location'}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <Navigation className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-gray-600">Distance</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">{travelInfo.distance}</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-semibold text-gray-600">Travel Time</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-600">{travelInfo.duration}</p>
                      <p className="text-xs text-gray-500 mt-1">via {travelMode === 'walking' ? 'Walking' : travelMode === 'driving' ? 'Driving' : 'Transit'}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
                    <span className="inline-block w-3 h-3 bg-blue-600 rounded-full"></span>
                    <span>Your Location</span>
                    <span className="mx-2">→</span>
                    <span className="inline-block w-3 h-3 bg-red-600 rounded-full"></span>
                    <span>{tripData.destination}</span>
                  </div>
                </div>
              )}
              
              {loadingPlaceInfo && (
                <div className="mb-6 bg-purple-50 p-6 rounded-xl border-2 border-purple-200 flex items-center justify-center space-x-3">
                  <Loader className="animate-spin w-5 h-5 text-purple-600" />
                  <span className="text-purple-700 font-semibold">Calculating travel info...</span>
                </div>
              )}

              <div className="w-full h-96 rounded-xl overflow-hidden border-2 border-gray-200 relative">
                {selectedPlace && (
                  <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-purple-300">
                    <p className="text-sm font-bold text-purple-600">📍 Showing: {selectedPlace.name}</p>
                  </div>
                )}
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={selectedPlace 
                    ? `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${userLocation ? `${userLocation.lat},${userLocation.lng}` : 'Manila,Philippines'}&destination=${encodeURIComponent(selectedPlace.address || selectedPlace.name)}&mode=${travelMode === 'motorcycle' ? 'driving' : travelMode}`
                    : `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${userLocation ? `${userLocation.lat},${userLocation.lng}` : 'Manila,Philippines'}&destination=${encodeURIComponent(tripData.destination + ', Metro Manila, Philippines')}&mode=${travelMode === 'motorcycle' ? 'driving' : travelMode}`
                  }>
                </iframe>
              </div>
              
              <div className="mt-4 flex justify-center gap-3">
                <a
                  href={selectedPlace
                    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation ? `${userLocation.lat},${userLocation.lng}` : 'Manila,Philippines'}&destination=${encodeURIComponent(selectedPlace.address || selectedPlace.name)}&travelmode=${travelMode === 'motorcycle' ? 'driving' : travelMode}`
                    : `https://www.google.com/maps/dir/?api=1&origin=${userLocation ? `${userLocation.lat},${userLocation.lng}` : 'Manila,Philippines'}&destination=${encodeURIComponent(tripData.destination + ', Metro Manila, Philippines')}&travelmode=${travelMode === 'motorcycle' ? 'driving' : travelMode}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Open in Google Maps</span>
                </a>
                {selectedPlace && selectedPlace.website && (
                  <a
                    href={selectedPlace.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Visit Website</span>
                  </a>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 rounded-2xl shadow-xl p-8 md:p-10 border-2 border-green-200 animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-4 rounded-xl shadow-lg">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900">Your Perfect Itinerary</h2>
                    <p className="text-gray-600 mt-1">AI-crafted for {tripData.days} day{tripData.days > 1 ? 's' : ''} in {tripData.destination}</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
                  <Calendar className="w-5 h-5 text-green-700" />
                  <span className="text-green-700 font-bold">{tripData.days} Days</span>
                </div>
              </div>

              {/* Trip Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl border-2 border-blue-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">DESTINATION</p>
                      <p className="text-lg font-bold text-gray-900">{tripData.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border-2 border-orange-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <DollarSign className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">TOTAL BUDGET</p>
                      <p className="text-lg font-bold text-gray-900">₱{tripData.budget.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border-2 border-purple-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Heart className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold">THEME</p>
                      <p className="text-lg font-bold text-gray-900 capitalize">{selectedTheme || 'Custom'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itinerary Content with Better Formatting */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6 max-h-96 overflow-y-auto">
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                  {itinerary.split('\n').map((line, idx) => {
                    // Style headers
                    if (line.startsWith('##')) {
                      return (
                        <div key={idx} className="mt-6 mb-3 pt-4 border-t-2 border-green-200">
                          <h3 className="text-xl font-bold text-green-700">{line.replace(/^#+\s/, '')}</h3>
                        </div>
                      );
                    }
                    // Style bold text
                    if (line.startsWith('**')) {
                      return (
                        <div key={idx} className="mt-3 mb-2 font-semibold text-gray-900 flex items-center space-x-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span>{line.replace(/\*\*/g, '')}</span>
                        </div>
                      );
                    }
                    // Regular text
                    if (line.trim()) {
                      return (
                        <p key={idx} className="text-gray-700 mb-2 leading-relaxed">
                          {line}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              {saveSuccess && (
                <div className="bg-green-50 border-2 border-green-300 text-green-700 px-6 py-4 rounded-xl mb-4 flex items-center space-x-3 animate-pulse">
                  <div className="bg-green-500 p-2 rounded-full">
                    <Save className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold">Trip Saved Successfully!</p>
                    <p className="text-sm">You can view it in your saved trips</p>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => { 
                    setItinerary(null); 
                    setTripData(null); 
                    setBudgetBreakdown(null); 
                    setRecommendations(null);
                    setCuratedPlaces([]);
                    setTravelInfo(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>✨ Plan Another Trip</span>
                </button>
                <button
                  onClick={handleSaveTrip}
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {saving ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>💾 Save This Trip</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
