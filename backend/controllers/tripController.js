const Trip = require('../models/Trip');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.generateItinerary = async (req, res) => {
  try {
    const { destination, budget, days, preferences, travelMode, suggestedPlaces } = req.body;
    const userId = req.user?.userId;

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
1. A structured daily schedule that EXCLUSIVELY uses and incorporates ALL the recommended places provided above:
${suggestedPlaces.map(p => `   - ${p.name} (Priority Venue)`).join('\n')}
2. Estimated costs for each activity (based on Philippine Peso)
3. Transportation recommendations (Walking: ₱0, Motorcycle: ~₱70/50km, Driving: ~₱70/10km, Transit: ₱16.25 base + ₱1.47/km)
4. Best time to visit each location
5. Tips for travelers
6. Total daily budget breakdown

Guidelines for costs:
- Budget Meals: ₱150 - ₱300
- Mid-range Meals: ₱400 - ₱800
- Fine Dining: ₱1,500+
- Most museums/parks: ₱50 - ₱300

Format the response in a clear, day-by-day structure using Markdown.`;

    let itineraryText;
    
    try {
      if (!isAiConfigured) {
        throw new Error('AI Service not configured');
      }

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
      });

      itineraryText = message.choices[0].message.content;
    } catch (aiError) {
      console.error('OpenAI API Error:', aiError.message);
      
      // Fallback: Generate a basic itinerary
      // Fallback: Generate an itinerary based on provided places
      const daysArray = Array.from({ length: parsedDays }, (_, i) => i + 1);
      const placesPerDay = Math.ceil(suggestedPlaces.length / parsedDays);
      
      itineraryText = `# ${parsedDays}-Day Itinerary for ${sanitizedDestination}
(Note: AI Service unavailable, generating template based on suggested spots)

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
