const axios = require('axios');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8';

// Smart Place Recommendations with AI
exports.getSmartRecommendations = async (req, res) => {
  try {
    let { destination, preferences, budget, travelMode = 'walking' } = req.body;
    
    // Safety check for Google API
    const apiMode = travelMode === 'motorcycle' ? 'driving' : travelMode;

    if (!destination) {
      return res.status(400).json({ message: 'Destination is required' });
    }

    // Geocode destination - try multiple variations
    let geocodeResponse;
    const searchVariations = [
      `${destination}, Metro Manila, Philippines`,
      `${destination}, Manila, Philippines`,
      `${destination}, Philippines`
    ];

    for (const searchTerm of searchVariations) {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchTerm)}&key=${GOOGLE_MAPS_API_KEY}`;
      geocodeResponse = await axios.get(geocodeUrl);
      
      if (geocodeResponse.data.status === 'OK') {
        break;
      }
    }

    if (!geocodeResponse || geocodeResponse.data.status !== 'OK' || !geocodeResponse.data.results[0]) {
      // Fallback: return popular places without specific location
      return res.status(200).json({
        message: 'Showing popular places in Metro Manila',
        destination: destination,
        centerLocation: { lat: 14.5995, lng: 120.9842 },
        places: [],
        count: 0,
        fallback: true
      });
    }

    const location = geocodeResponse.data.results[0].geometry.location;

    // Define place types based on preferences
    const placeTypeMap = {
      'cafes': 'cafe',
      'cafe': 'cafe',
      'coffee': 'cafe',
      'restaurants': 'restaurant',
      'food': 'restaurant',
      'cultural': 'museum',
      'culture': 'museum',
      'dating': 'restaurant',
      'romantic': 'restaurant',
      'parks': 'park',
      'shopping': 'shopping_mall',
      'nightlife': 'night_club',
      'adventure': 'tourist_attraction'
    };

    const types = preferences?.map(pref => 
      placeTypeMap[pref.toLowerCase()] || 'tourist_attraction'
    ) || ['tourist_attraction'];

    // Fetch nearby places
    const places = [];
    for (const type of [...new Set(types)]) {
      try {
        const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=5000&type=${type}&key=${GOOGLE_MAPS_API_KEY}`;
        const placesResponse = await axios.get(placesUrl);
        
        if (placesResponse.data.results && placesResponse.data.results.length > 0) {
          // Get top rated places
          const topPlaces = placesResponse.data.results
            .filter(p => p.rating && p.rating >= 4.0)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 8);
          places.push(...topPlaces);
        }
      } catch (err) {
        console.error(`Error fetching ${type}:`, err.message);
      }
    }

    // If no places found, return empty with success
    if (places.length === 0) {
      return res.status(200).json({
        message: 'No places found nearby',
        destination: geocodeResponse.data.results[0].formatted_address,
        centerLocation: location,
        places: [],
        count: 0
      });
    }

    // Calculate distances and travel times
    const enrichedPlaces = await Promise.all(
      places.slice(0, 10).map(async (place) => {
        try {
          const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${location.lat},${location.lng}&destinations=${place.geometry.location.lat},${place.geometry.location.lng}&mode=${apiMode}&key=${GOOGLE_MAPS_API_KEY}`;
          const distanceResponse = await axios.get(distanceUrl);
          const element = distanceResponse.data.rows[0]?.elements[0];

          return {
            name: place.name,
            address: place.vicinity,
            rating: place.rating || 'N/A',
            priceLevel: place.price_level || 0,
            distance: element?.distance?.text || 'N/A',
            duration: element?.duration?.text || 'N/A',
            distanceValue: element?.distance?.value || 0,
            durationValue: element?.duration?.value || 0,
            location: place.geometry.location,
            types: place.types,
            isOpen: place.opening_hours?.open_now
          };
        } catch (err) {
          console.error('Distance calculation error:', err.message);
          return {
            name: place.name,
            address: place.vicinity,
            rating: place.rating || 'N/A',
            priceLevel: place.price_level || 0,
            location: place.geometry.location,
            types: place.types
          };
        }
      })
    );

    // Sort by distance
    const sorted = enrichedPlaces.sort((a, b) => 
      (a.distanceValue || 999999) - (b.distanceValue || 999999)
    );

    res.status(200).json({
      message: 'Recommendations retrieved successfully',
      destination: geocodeResponse.data.results[0].formatted_address,
      centerLocation: location,
      places: sorted,
      count: sorted.length,
      travelMode
    });
  } catch (error) {
    console.error('Error getting recommendations:', error.message);
    res.status(500).json({ 
      message: 'Error fetching recommendations',
      error: error.message 
    });
  }
};

// Generate Themed Trip Plans
exports.generateThemedPlan = async (req, res) => {
  try {
    const { destination, theme, budget, duration = 1 } = req.body;

    if (!destination || !theme) {
      return res.status(400).json({ message: 'Destination and theme are required' });
    }

    const themePrompts = {
      'romantic': 'romantic date spots, intimate restaurants, scenic viewpoints, and couple-friendly activities',
      'food': 'best local restaurants, street food spots, cafes, and food markets',
      'cultural': 'museums, historical sites, art galleries, and cultural landmarks',
      'adventure': 'outdoor activities, adventure sports, hiking trails, and exciting experiences',
      'cafe': 'trendy cafes, coffee shops, dessert places, and Instagram-worthy spots',
      'nightlife': 'bars, clubs, live music venues, and evening entertainment'
    };

    const themeDescription = themePrompts[theme.toLowerCase()] || 'tourist attractions and activities';

    const prompt = `Create a detailed ${duration}-day ${theme} themed itinerary for ${destination}, Metro Manila with a budget of ₱${budget}.

Focus on: ${themeDescription}

Include:
1. Specific place names with addresses
2. Estimated costs per location
3. Best time to visit each place
4. Travel time between locations
5. Insider tips and recommendations
6. Total estimated budget breakdown

Format as a day-by-day plan with morning, afternoon, and evening activities.`;

    let itinerary;
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      });
      itinerary = response.choices[0].message.content;
    } catch (aiError) {
      console.error('OpenAI Error:', aiError.message);
      
      // Fallback themed plan
      itinerary = `# ${duration}-Day ${theme.toUpperCase()} Plan in ${destination}\n\nBudget: ₱${budget.toLocaleString()}\n\n## Day 1\n\n**Morning (9:00 AM - 12:00 PM)**\n- Start your ${theme} adventure in ${destination}\n- Estimated cost: ₱${Math.round(budget / duration / 3)}\n\n**Afternoon (1:00 PM - 5:00 PM)**\n- Continue exploring ${theme}-themed locations\n- Estimated cost: ₱${Math.round(budget / duration / 3)}\n\n**Evening (6:00 PM - 9:00 PM)**\n- End your day with ${theme} activities\n- Estimated cost: ₱${Math.round(budget / duration / 3)}\n\n**Tips:**\n- Book in advance for popular spots\n- Check opening hours before visiting\n- Bring extra budget for unexpected finds`;
    }

    res.status(200).json({
      message: 'Themed plan generated successfully',
      theme,
      destination,
      duration,
      budget,
      itinerary
    });
  } catch (error) {
    console.error('Error generating themed plan:', error.message);
    res.status(500).json({ message: 'Error generating themed plan' });
  }
};

// Route Optimization
exports.optimizeRoute = async (req, res) => {
  try {
    const { origin, destinations, travelMode = 'driving' } = req.body;

    if (!origin || !destinations || destinations.length < 2) {
      return res.status(400).json({ message: 'Origin and at least 2 destinations required' });
    }

    const waypoints = destinations.slice(0, 8).join('|');
    const apiMode = travelMode === 'motorcycle' ? 'driving' : travelMode;
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destinations[destinations.length - 1])}&waypoints=optimize:true|${waypoints}&mode=${apiMode}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await axios.get(directionsUrl);

    if (response.data.status !== 'OK') {
      return res.status(400).json({ message: 'Unable to optimize route' });
    }

    const route = response.data.routes[0];
    const optimizedOrder = route.waypoint_order;
    const legs = route.legs;

    const optimizedRoute = {
      totalDistance: legs.reduce((sum, leg) => sum + leg.distance.value, 0),
      totalDuration: legs.reduce((sum, leg) => sum + leg.duration.value, 0),
      optimizedOrder: optimizedOrder,
      steps: legs.map((leg, index) => ({
        from: leg.start_address,
        to: leg.end_address,
        distance: leg.distance.text,
        duration: leg.duration.text,
        order: index + 1
      }))
    };

    res.status(200).json({
      message: 'Route optimized successfully',
      route: optimizedRoute,
      totalDistance: `${(optimizedRoute.totalDistance / 1000).toFixed(1)} km`,
      totalDuration: `${Math.round(optimizedRoute.totalDuration / 60)} minutes`
    });
  } catch (error) {
    console.error('Error optimizing route:', error.message);
    res.status(500).json({ message: 'Error optimizing route' });
  }
};

// Get Place Details with Reviews
exports.getPlaceDetails = async (req, res) => {
  try {
    const { placeName, location } = req.body;

    if (!placeName) {
      return res.status(400).json({ message: 'Place name is required' });
    }

    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(placeName)}&inputtype=textquery&fields=place_id,name,rating,formatted_address&locationbias=circle:5000@${location || '14.5995,120.9842'}&key=${GOOGLE_MAPS_API_KEY}`;
    
    const searchResponse = await axios.get(searchUrl);

    if (!searchResponse.data.candidates || searchResponse.data.candidates.length === 0) {
      return res.status(404).json({ message: 'Place not found' });
    }

    const placeId = searchResponse.data.candidates[0].place_id;
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,formatted_address,formatted_phone_number,opening_hours,website,price_level,reviews,photos&key=${GOOGLE_MAPS_API_KEY}`;
    
    const detailsResponse = await axios.get(detailsUrl);

    res.status(200).json({
      message: 'Place details retrieved successfully',
      place: detailsResponse.data.result
    });
  } catch (error) {
    console.error('Error getting place details:', error.message);
    res.status(500).json({ message: 'Error fetching place details' });
  }
};

// Calculate Distance from User Location to Destination
exports.calculateDistance = async (req, res) => {
  try {
    let { origin, destination, travelMode = 'walking' } = req.body;
    
    // Safety check for Google API
    const apiMode = travelMode === 'motorcycle' ? 'driving' : travelMode;

    if (!origin || !destination) {
      return res.status(400).json({ message: 'Origin and destination are required' });
    }

    // Build destination with Metro Manila context
    const fullDestination = destination.includes('Philippines') 
      ? destination 
      : `${destination}, Metro Manila, Philippines`;

    const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(fullDestination)}&mode=${apiMode}&key=${GOOGLE_MAPS_API_KEY}`;
    
    const response = await axios.get(distanceUrl);

    if (response.data.status !== 'OK' || !response.data.rows[0]?.elements[0]) {
      return res.status(400).json({ message: 'Unable to calculate distance' });
    }

    const element = response.data.rows[0].elements[0];

    if (element.status !== 'OK') {
      return res.status(400).json({ message: 'Route not found' });
    }

    res.status(200).json({
      message: 'Distance calculated successfully',
      origin: response.data.origin_addresses[0],
      destination: response.data.destination_addresses[0],
      distance: element.distance.text,
      duration: element.duration.text,
      distanceValue: element.distance.value,
      durationValue: element.duration.value,
      travelMode
    });
  } catch (error) {
    console.error('Error calculating distance:', error.message);
    res.status(500).json({ message: 'Error calculating distance' });
  }
};

// Get Curated Places with Photos
exports.getCuratedPlaces = async (req, res) => {
  try {
    const { destination, theme } = req.body;

    if (!destination) {
      return res.status(400).json({ message: 'Destination is required' });
    }

    // --- Step 1: Static Fallback Database (Guarantees suggestions work even if API fails) ---
    const staticPlaces = {
      'bgc': [
        { name: 'Bonifacio High Street', address: 'BGC, Taguig', rating: 4.8, priceLevel: 2, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500', theme: ['shopping', 'food', 'romantic'], location: { lat: 14.5511, lng: 121.0515 } },
        { name: 'The Mind Museum', address: 'JY Campos Park, BGC', rating: 4.6, priceLevel: 3, image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=500', theme: ['cultural'], location: { lat: 14.5519, lng: 121.0458 } },
        { name: 'Wildflour Cafe + Bakery', address: 'Net Lima, BGC', rating: 4.5, priceLevel: 3, image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500', theme: ['cafe', 'food'], location: { lat: 14.5492, lng: 121.0451 } },
        { name: 'Venice Grand Canal Mall', address: 'McKinley Hill, Taguig', rating: 4.7, priceLevel: 2, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500', theme: ['romantic', 'shopping'], location: { lat: 14.5350, lng: 121.0361 } },
        { name: 'Uptown Mall', address: '9th Ave, BGC', rating: 4.6, priceLevel: 3, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500', theme: ['shopping', 'food', 'nightlife'], location: { lat: 14.5562, lng: 121.0547 } },
        { name: 'SM Aura Premier', address: 'McKinley Pkwy, BGC', rating: 4.6, priceLevel: 3, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500', theme: ['shopping', 'food'], location: { lat: 14.5476, lng: 121.0543 } }
      ],
      'makati': [
        { name: 'Ayala Triangle Gardens', address: 'Paseo de Roxas, Makati', rating: 4.7, priceLevel: 0, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500', theme: ['romantic', 'cultural'], location: { lat: 14.5571, lng: 121.0231 } },
        { name: 'Greenbelt Mall', address: 'Ayala Center, Makati', rating: 4.6, priceLevel: 3, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500', theme: ['shopping', 'food'], location: { lat: 14.5535, lng: 121.0211 } },
        { name: 'SM Makati', address: 'Ayala Center, Makati', rating: 4.5, priceLevel: 2, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500', theme: ['shopping', 'food'], location: { lat: 14.5511, lng: 121.0251 } },
        { name: 'Glorietta Mall', address: 'Ayala Center, Makati', rating: 4.5, priceLevel: 2, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500', theme: ['shopping', 'food'], location: { lat: 14.5518, lng: 121.0253 } },
        { name: 'Puregold Makati', address: 'J.P. Rizal St, Makati', rating: 4.2, priceLevel: 1, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500', theme: ['shopping'], location: { lat: 14.5721, lng: 121.0211 } }
      ],
      'intramuros': [
        { name: 'SM Mall of Asia', address: 'Seaside Blvd, Pasay', rating: 4.8, priceLevel: 2, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500', theme: ['shopping', 'food', 'romantic'], location: { lat: 14.5351, lng: 120.9822 } },
        { name: 'Fort Santiago', address: 'Intramuros, Manila', rating: 4.8, priceLevel: 1, image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=500', theme: ['cultural'], location: { lat: 14.5940, lng: 120.9702 } },
        { name: 'San Agustin Church', address: 'General Luna St, Intramuros', rating: 4.7, priceLevel: 0, image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=500', theme: ['cultural'], location: { lat: 14.5891, lng: 120.9752 } },
        { name: 'Puregold Manila', address: 'San Marcelino St, Manila', rating: 4.2, priceLevel: 1, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500', theme: ['shopping'], location: { lat: 14.5851, lng: 120.9881 } },
        { name: 'Vista Mall (AllMall)', address: 'Global South, Las Piñas', rating: 4.4, priceLevel: 2, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500', theme: ['shopping', 'food'], location: { lat: 14.4751, lng: 120.9811 } }
      ]
    };

    const destLower = destination.toLowerCase();
    let area = 'bgc'; // Default area
    if (destLower.includes('bgc') || destLower.includes('taguig')) area = 'bgc';
    else if (destLower.includes('makati')) area = 'makati';
    else if (destLower.includes('intramuros') || destLower.includes('manila')) area = 'intramuros';

    let results = staticPlaces[area];
    if (theme) {
      const themeLower = theme.toLowerCase();
      const filtered = results.filter(p => p.theme.includes(themeLower));
      if (filtered.length > 0) results = filtered;
    }

    // Map static data to the expected format
    const enrichedPlaces = results.map(p => ({
      name: p.name,
      address: p.address,
      rating: p.rating,
      priceLevel: p.priceLevel,
      image: p.image,
      location: p.location,
      placeId: `static-${p.name.toLowerCase().replace(/\s+/g, '-')}`,
      types: p.theme,
      userRatingsTotal: 1000 + Math.floor(Math.random() * 5000),
      isGem: p.rating >= 4.7,
      description: `Popular spot in ${area.toUpperCase()}`,
      isOpen: true
    }));

    res.status(200).json({
      message: 'Curated places retrieved successfully (Static Fallback)',
      destination,
      theme,
      places: enrichedPlaces,
      count: enrichedPlaces.length
    });
  } catch (error) {
    console.error('Error in getCuratedPlaces:', error.message);
    res.status(500).json({ message: 'Error fetching curated places' });
  }
};

// Get Explore Destinations with Real Images
exports.getExploreDestinations = async (req, res) => {
  try {
    const destinationNames = [
      { name: 'Intramuros', search: 'Intramuros Manila', type: 'Historic Site' },
      { name: 'Makati CBD', search: 'Makati Central Business District', type: 'Business District' },
      { name: 'BGC', search: 'Bonifacio Global City Taguig', type: 'Entertainment' },
      { name: 'Taguig City', search: 'Taguig City Metro Manila', type: 'Tourist Destination' },
      { name: 'Quezon City', search: 'Quezon City Metro Manila', type: 'Cultural Hub' },
      { name: 'Rizal Park', search: 'Rizal Park Luneta Manila', type: 'Nature' }
    ];

    const enrichedDestinations = await Promise.all(
      destinationNames.map(async (dest, index) => {
        try {
          const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(dest.search)}&key=${GOOGLE_MAPS_API_KEY}`;
          const searchResponse = await axios.get(searchUrl);

          if (searchResponse.data.results && searchResponse.data.results[0]) {
            const place = searchResponse.data.results[0];
            
            let photoUrl = `https://images.unsplash.com/photo-${['1583417319070-4a69db38a482', '1555993539-1732b0258235', '1551882547-ff40c63fe5fa', '1559827260-dc66d52bef19', '1542744173-8e7e53415bb0', '1585320806297-9794b3e4eeae'][index]}?w=800&q=80`;
            
            if (place.photos && place.photos[0]) {
              const photoReference = place.photos[0].photo_reference;
              photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
            }

            return {
              id: index + 1,
              name: dest.name,
              type: dest.type,
              rating: place.rating || 4.5,
              description: place.formatted_address || `Discover the beauty and culture of ${dest.name} in Metro Manila.`,
              image: photoUrl,
              address: place.formatted_address,
              placeId: place.place_id,
              userRatingsTotal: place.user_ratings_total || 0
            };
          }
        } catch (err) {
          console.error(`Error fetching ${dest.name}:`, err.message);
        }
        
        // Fallback
        return {
          id: index + 1,
          name: dest.name,
          type: dest.type,
          rating: 4.5,
          description: `Discover the beauty and culture of ${dest.name} in Metro Manila.`,
          image: `https://images.unsplash.com/photo-${['1583417319070-4a69db38a482', '1555993539-1732b0258235', '1551882547-ff40c63fe5fa', '1559827260-dc66d52bef19', '1542744173-8e7e53415bb0', '1585320806297-9794b3e4eeae'][index]}?w=800&q=80`,
          userRatingsTotal: 0
        };
      })
    );

    res.status(200).json({
      message: 'Explore destinations retrieved successfully',
      destinations: enrichedDestinations.filter(d => d !== null),
      count: enrichedDestinations.filter(d => d !== null).length
    });
  } catch (error) {
    console.error('Error getting explore destinations:', error.message);
    res.status(500).json({ 
      message: 'Error fetching explore destinations',
      error: error.message 
    });
  }
};
