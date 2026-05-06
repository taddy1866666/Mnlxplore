const Trip = require('../models/Trip');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.generateItinerary = async (req, res) => {
  try {
    const { destination, budget, days, preferences } = req.body;
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

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-key') {
      return res.status(500).json({ message: 'AI service not configured' });
    }

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

    // Generate itinerary using OpenAI
    const sanitizedPreferences = Array.isArray(preferences) ? preferences.join(', ') : 'General tourism';
    const prompt = `Create a detailed ${parsedDays}-day travel itinerary for ${sanitizedDestination}, Philippines with a budget of ₱${parsedBudget}. 
    
Preferences: ${sanitizedPreferences}

Include:
1. Daily schedule with specific attractions, restaurants, and activities
2. Estimated costs for each activity
3. Transportation recommendations
4. Best time to visit each location
5. Tips for travelers

Format the response in a clear, day-by-day structure.`;

    let itineraryText;
    
    try {
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
      itineraryText = `# ${parsedDays}-Day Itinerary for ${sanitizedDestination}

Budget: ₱${parsedBudget.toLocaleString()}
Preferences: ${sanitizedPreferences}

${Array.from({ length: parsedDays }, (_, i) => `
## Day ${i + 1}

**Morning (8:00 AM - 12:00 PM)**
- Visit local attractions in ${sanitizedDestination}
- Estimated cost: ₱${Math.round(parsedBudget / parsedDays / 3)}

**Afternoon (1:00 PM - 5:00 PM)**
- Explore nearby restaurants and cafes
- Try local cuisine
- Estimated cost: ₱${Math.round(parsedBudget / parsedDays / 3)}

**Evening (6:00 PM - 10:00 PM)**
- Evening activities and entertainment
- Estimated cost: ₱${Math.round(parsedBudget / parsedDays / 3)}
`).join('')}

**Transportation Tips:**
- Use ride-sharing apps or public transport
- Budget for daily transport: ₱200-500

**Important Notes:**
- This is a basic itinerary template
- For AI-powered personalized recommendations, please check your OpenAI API configuration
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
