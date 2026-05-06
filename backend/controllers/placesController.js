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

    // Geocode destination
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

    if (!geocodeResponse || geocodeResponse.data.status !== 'OK') {
      return res.status(400).json({ message: 'Invalid destination' });
    }

    const location = geocodeResponse.data.results[0].geometry.location;

    // Map themes to place types - EXPANDED
    const themeTypeMap = {
      'romantic': ['restaurant', 'park', 'cafe', 'bar', 'tourist_attraction'],
      'food': ['restaurant', 'cafe', 'bakery', 'meal_takeaway', 'meal_delivery'],
      'cafe': ['cafe', 'bakery', 'coffee'],
      'cultural': ['museum', 'art_gallery', 'church', 'tourist_attraction', 'library', 'university'],
      'shopping': ['shopping_mall', 'department_store', 'clothing_store', 'store'],
      'nightlife': ['night_club', 'bar', 'casino', 'bowling_alley']
    };

    const types = themeTypeMap[theme] || ['tourist_attraction', 'restaurant', 'cafe'];

    // Fetch ALL places for each type - NO LIMITS
    const allPlaces = [];
    const seenPlaceIds = new Set();

    for (const type of types) {
      try {
        // First request
        let placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=5000&type=${type}&key=${GOOGLE_MAPS_API_KEY}`;
        let placesResponse = await axios.get(placesUrl);
        
        if (placesResponse.data.results) {
          placesResponse.data.results.forEach(place => {
            if (!seenPlaceIds.has(place.place_id)) {
              seenPlaceIds.add(place.place_id);
              allPlaces.push(place);
            }
          });

          // Get next page if available
          let nextPageToken = placesResponse.data.next_page_token;
          let attempts = 0;
          
          while (nextPageToken && attempts < 2) {
            // Wait 2 seconds before next page request (Google requirement)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const nextUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${nextPageToken}&key=${GOOGLE_MAPS_API_KEY}`;
            const nextResponse = await axios.get(nextUrl);
            
            if (nextResponse.data.results) {
              nextResponse.data.results.forEach(place => {
                if (!seenPlaceIds.has(place.place_id)) {
                  seenPlaceIds.add(place.place_id);
                  allPlaces.push(place);
                }
              });
            }
            
            nextPageToken = nextResponse.data.next_page_token;
            attempts++;
          }
        }
      } catch (err) {
        console.error(`Error fetching ${type}:`, err.message);
      }
    }

    // Balance "Sikat" (Popular) and "Hidden Gems"
    const popularPlaces = allPlaces
      .filter(p => (p.user_ratings_total || 0) >= 200 && (p.rating || 0) >= 4.0)
      .sort((a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0))
      .slice(0, 10);

    const hiddenGems = allPlaces
      .filter(p => (p.user_ratings_total || 0) < 200 && (p.user_ratings_total || 0) > 5 && (p.rating || 0) >= 4.2)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10);

    // Combine them to show a variety
    const topPlaces = [...popularPlaces, ...hiddenGems];

    // Enrich with REAL photos from Google
    const enrichedPlaces = await Promise.all(
      topPlaces.map(async (place) => {
        let photoUrl = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500';
        
        // Get REAL photo from Google Places
        if (place.photos && place.photos[0]) {
          const photoReference = place.photos[0].photo_reference;
          photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
        }

        // Get place details for more info
        let description = '';
        let website = '';
        let phone = '';
        
        try {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=editorial_summary,website,formatted_phone_number,opening_hours&key=${GOOGLE_MAPS_API_KEY}`;
          const detailsResponse = await axios.get(detailsUrl);
          
          if (detailsResponse.data.result) {
            description = detailsResponse.data.result.editorial_summary?.overview || '';
            website = detailsResponse.data.result.website || '';
            phone = detailsResponse.data.result.formatted_phone_number || '';
          }
        } catch (err) {
          console.error('Error fetching place details:', err.message);
        }

        return {
          name: place.name,
          address: place.vicinity,
          rating: place.rating,
          priceLevel: place.price_level || 0,
          image: photoUrl,
          location: place.geometry.location,
          placeId: place.place_id,
          types: place.types,
          userRatingsTotal: place.user_ratings_total,
          isGem: (place.user_ratings_total || 0) < 200,
          description: description || `Popular ${place.types[0].replace('_', ' ')} in ${destination}`,
          website: website,
          phone: phone,
          isOpen: place.opening_hours?.open_now
        };
      })
    );

    res.status(200).json({
      message: 'Curated places retrieved successfully',
      destination: geocodeResponse.data.results[0].formatted_address,
      theme,
      places: enrichedPlaces,
      count: enrichedPlaces.length
    });
  } catch (error) {
    console.error('Error getting curated places:', error.message);
    res.status(500).json({ 
      message: 'Error fetching curated places',
      error: error.message 
    });
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
