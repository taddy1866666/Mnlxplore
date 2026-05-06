import Link from 'next/link';
import { MapPin, Star, MapPinIcon, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Explore() {
  const destinations = [
    {
      id: 1,
      name: 'Intramuros',
      type: 'Historic Site',
      rating: 4.5,
      description: 'Historic walled district in Manila with colonial architecture and museums.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Intramuros_Manila_Philippines.jpg/1200px-Intramuros_Manila_Philippines.jpg',
      userRatingsTotal: 15420
    },
    {
      id: 2,
      name: 'Makati CBD',
      type: 'Business District',
      rating: 4.2,
      description: 'Modern business and commercial hub with restaurants and shopping centers.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Makati_CBD_Skyline.jpg/1200px-Makati_CBD_Skyline.jpg',
      userRatingsTotal: 8932
    },
    {
      id: 3,
      name: 'BGC (Bonifacio Global City)',
      type: 'Entertainment',
      rating: 4.7,
      description: 'Vibrant district with shopping, dining, and entertainment options.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/BGC_Taguig_Skyline.jpg/1200px-BGC_Taguig_Skyline.jpg',
      userRatingsTotal: 12543
    },
    {
      id: 4,
      name: 'Taguig City',
      type: 'Tourist Destination',
      rating: 4.4,
      description: 'Modern city with malls, restaurants, and cultural attractions.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Venice_Grand_Canal_Mall_Taguig.jpg/1200px-Venice_Grand_Canal_Mall_Taguig.jpg',
      userRatingsTotal: 6721
    },
    {
      id: 5,
      name: 'Quezon City',
      type: 'Cultural Hub',
      rating: 4.3,
      description: 'Educational and cultural center with museums and local markets.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Quezon_Memorial_Circle.jpg/1200px-Quezon_Memorial_Circle.jpg',
      userRatingsTotal: 9834
    },
    {
      id: 6,
      name: 'Rizal Park',
      type: 'Nature',
      rating: 4.6,
      description: 'Green space and historic monument in the heart of Manila.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Rizal_Park_Manila.jpg/1200px-Rizal_Park_Manila.jpg',
      userRatingsTotal: 18234
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Destinations</span>
          </h1>
          <p className="text-xl text-gray-600">Discover amazing places in Metro Manila</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2"
            >
              <div className="h-48 relative overflow-hidden bg-gray-200">
                <img 
                  src={dest.image} 
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-lg">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-bold text-gray-900">{dest.rating}</span>
                </div>
                
                {dest.userRatingsTotal && (
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                    <span className="text-xs font-semibold text-white">{dest.userRatingsTotal.toLocaleString()} reviews</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{dest.name}</h3>
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {dest.type}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-6">{dest.description}</p>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest.name + ', Metro Manila')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg group"
                >
                  <span>View on Map</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
