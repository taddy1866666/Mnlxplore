const Trip = require('../models/Trip');
const { OpenAI } = require('openai');
const { apiCache } = require('../utils/cache');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.generateItinerary = async (req, res) => {
  try {
    const { destination, budget, days, preferences, travelMode, suggestedPlaces = [] } = req.body;
    console.log(`[Itinerary] Generating for ${destination} (${days} days)...`);
    const userId = req.user?.userId;

    // Generate unique cache key
    const cacheKey = `itinerary_${destination}_${budget}_${days}_${JSON.stringify(preferences)}_${travelMode}_${JSON.stringify(suggestedPlaces?.map(p => p.name))}`;
    
    const cachedResult = apiCache.get(cacheKey);
    if (cachedResult) {
      console.log(`[Cache] Hit for ${destination}`);
      return res.status(200).json({
        message: 'Itinerary retrieved from system cache',
        itinerary: cachedResult,
        cached: true
      });
    }

    // Validate input
    if (!destination || !budget || !days) {
      return res.status(400).json({ message: 'Destination, budget, and days are required' });
    }

    // Sanitize and validate inputs
    const sanitizedDestination = destination.trim().substring(0, 100);
    const parsedBudget = parseFloat(budget);
    const parsedDays = parseInt(days);

    if (isNaN(parsedBudget) || parsedBudget <= 0 || parsedBudget > 1000000) {
      return res.status(400).json({ message: 'Invalid budget amount' });
    }

    if (isNaN(parsedDays) || parsedDays <= 0 || parsedDays > 30) {
      return res.status(400).json({ message: 'Days must be between 1 and 30' });
    }

    // If AI service is not configured, we'll proceed to the fallback logic automatically
    const isAiConfigured = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-key';

    // Create trip record
    let trip = null;
    if (userId) {
      trip = new Trip({
        user: userId,
        destination: sanitizedDestination,
        budget: parsedBudget,
        days: parsedDays,
        preferences: Array.isArray(preferences) ? preferences.slice(0, 10) : []
      });
    }

    // Format suggested places for context
    const placesContext = suggestedPlaces && suggestedPlaces.length > 0
      ? `\nRecommended places from Google Maps (YOU MUST PRIORITIZE THESE):\n${suggestedPlaces.slice(0, 8).map(p => `- ${p.name}: ${p.description}`).join('\n')}`
      : '';

    // Generate itinerary using OpenAI
    const sanitizedPreferences = Array.isArray(preferences) ? preferences.join(', ') : 'General tourism';
    const prompt = `Create a detailed ${parsedDays}-day travel itinerary for ${sanitizedDestination}, Philippines with a budget of ₱${parsedBudget}. 
    
Preferences: ${sanitizedPreferences}
Travel Mode: ${travelMode || 'walking'}${placesContext}

Include:
1. A structured daily schedule using clean headings (## Day X) and subheadings (### Activity Name).
2. ABSOLUTELY DO NOT USE DOUBLE ASTERISKS (**) FOR BOLDING. DO NOT USE ASTERISKS (*) ANYWHERE IN THE TEXT.
3. Use plain text for descriptions and simple dashes (-) for bullet points.
4. Estimated costs for each activity (based on Philippine Peso).
5. Specific local transit routes (Jeepney/LRT/MRT).
6. Total daily budget breakdown at the end of each day.

Format the output clearly using only Markdown headers (## and ###) and plain text paragraphs.
`;

    let itineraryText;
    
    try {
      if (!isAiConfigured) {
        throw new Error('AI Service not configured');
      }

      console.log(`[AI] Requesting generation for ${sanitizedDestination}...`);
      const message = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }, { timeout: 5000 });

      itineraryText = message.choices[0].message.content;
      console.log(`[AI] Successfully generated itinerary for ${sanitizedDestination}`);
    } catch (aiError) {
      console.error('OpenAI API Error:', aiError.message);
      
      // Fallback: Generate a basic itinerary
      // Fallback: Generate an itinerary based on provided places
      const daysArray = Array.from({ length: parsedDays }, (_, i) => i + 1);
      const placesPerDay = Math.ceil(suggestedPlaces.length / parsedDays);
      
      itineraryText = `# ${parsedDays}-Day Itinerary for ${sanitizedDestination}
(Note: Smart service offline, generating template based on suggested spots)

Budget: ₱${parsedBudget.toLocaleString()}
Preferences: ${sanitizedPreferences}

${daysArray.map(day => {
  const dayPlaces = suggestedPlaces.slice((day - 1) * placesPerDay, day * placesPerDay);
  return `
## Day ${day}
${dayPlaces.length > 0 ? dayPlaces.map((p, idx) => `
**${idx === 0 ? 'Morning' : idx === 1 ? 'Afternoon' : 'Evening'} Activity**
- Visit **${p.name}**
- Location: ${p.address}
- Description: ${p.description || 'Popular local spot'}
- Estimated cost: ₱${Math.round(parsedBudget / (parsedDays * 3))}
`).join('') : `
**Explore ${sanitizedDestination}**
- Visit local spots and enjoy the atmosphere
- Estimated cost: ₱${Math.round(parsedBudget / (parsedDays * 3))}
`}
`;}).join('')}

**Transportation Tips:**
- Mode: ${travelMode || 'Walking'}
- Daily budget for transport: ₱${Math.round((parsedBudget * 0.15) / parsedDays)}

**Important Notes:**
- This itinerary is built using your curated places: ${suggestedPlaces.map(p => p.name).join(', ')}
- Adjust activities based on your interests: ${sanitizedPreferences}`;
    }

    // Save to cache for future requests
    apiCache.set(cacheKey, itineraryText);

    // Save trip if user is authenticated
    if (trip) {
      trip.itinerary = itineraryText;
      await trip.save();
    }

    res.status(200).json({
      message: 'Itinerary generated successfully',
      itinerary: itineraryText,
      tripId: trip?._id || null
    });
  } catch (error) {
    console.error('Error generating itinerary:', error.message);
    res.status(500).json({ 
      message: 'Error generating itinerary'
    });
  }
};

exports.saveTrip = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { destination, budget, days, preferences, itinerary } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Validate and sanitize inputs
    if (!destination || !budget || !days) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const parsedBudget = parseFloat(budget);
    const parsedDays = parseInt(days);

    if (isNaN(parsedBudget) || parsedBudget <= 0 || parsedBudget > 1000000) {
      return res.status(400).json({ message: 'Invalid budget' });
    }

    if (isNaN(parsedDays) || parsedDays <= 0 || parsedDays > 30) {
      return res.status(400).json({ message: 'Invalid days' });
    }

    const trip = new Trip({
      user: userId,
      destination: destination.trim().substring(0, 100),
      budget: parsedBudget,
      days: parsedDays,
      preferences: Array.isArray(preferences) ? preferences.slice(0, 10) : [],
      itinerary: itinerary ? itinerary.substring(0, 10000) : '',
      status: 'completed'
    });

    await trip.save();

    res.status(201).json({
      message: 'Trip saved successfully',
      trip
    });
  } catch (error) {
    console.error('Error saving trip:', error.message);
    res.status(500).json({ message: 'Error saving trip' });
  }
};

exports.getUserTrips = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const trips = await Trip.find({ user: userId })
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      message: 'Trips retrieved successfully',
      trips
    });
  } catch (error) {
    console.error('Error retrieving trips:', error.message);
    res.status(500).json({ message: 'Error retrieving trips' });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { tripId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Validate tripId format
    if (!tripId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid trip ID' });
    }

    const trip = await Trip.findById(tripId);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    if (trip.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Trip.findByIdAndDelete(tripId);

    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error.message);
    res.status(500).json({ message: 'Error deleting trip' });
  }
};
