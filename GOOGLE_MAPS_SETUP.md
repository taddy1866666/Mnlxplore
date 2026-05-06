# 🗺️ Google Maps API Setup Guide

## Current Status
⚠️ **The Google Maps API key in the code is a demo/invalid key and needs to be replaced.**

## Quick Fix (Development)

### Option 1: Get Your Own API Key (Recommended)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create/Select Project**
   - Click "Select a project" → "New Project"
   - Name: `MNLXPLORE` → Create

3. **Enable APIs**
   - Go to "APIs & Services" → "Library"
   - Search and enable:
     - ✅ Maps JavaScript API
     - ✅ Geocoding API
     - ✅ Places API

4. **Create API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the generated key

5. **Restrict API Key (Important for Security)**
   - Click on your API key
   - Under "Application restrictions":
     - Select "HTTP referrers (web sites)"
     - Add: `http://localhost:3000/*` (development)
     - Add: `https://yourdomain.com/*` (production)
   - Under "API restrictions":
     - Select "Restrict key"
     - Choose: Maps JavaScript API, Geocoding API, Places API
   - Save

6. **Add to Environment Variables**
   ```bash
   # C:\Projects\htdocs\Mnlxplore\frontend\.env.local
   NEXT_PUBLIC_API_URL=http://localhost:5001
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
   ```

7. **Restart Frontend**
   ```powershell
   cd C:\Projects\htdocs\Mnlxplore\frontend
   npm run dev
   ```

### Option 2: Disable Map Feature (Quick Workaround)

If you don't need maps right now, the app will show a fallback UI automatically when the API key is missing or invalid.

The fallback displays:
- Destination name
- Location text
- Helpful message about map unavailability

## Features Implemented

### ✅ Senior Dev Best Practices

1. **Environment Variables**
   - API key stored in `.env.local` (not hardcoded)
   - Proper Next.js public variable naming

2. **Error Handling**
   - Graceful fallback UI when map fails
   - Console warnings for debugging
   - User-friendly error messages

3. **Performance**
   - Lazy loading strategy for Google Maps script
   - useRef for DOM manipulation (no getElementById)
   - Proper cleanup and memory management

4. **User Experience**
   - Loading states
   - Error states with helpful messages
   - Info windows on markers
   - Animated marker drops
   - Responsive map controls

5. **Security**
   - API key restrictions recommended
   - Environment variable isolation
   - No sensitive data in client code

## Troubleshooting

### Map shows "Map Unavailable"
**Cause:** Invalid or missing API key
**Fix:** Follow Option 1 above to get a valid API key

### "This page didn't load Google Maps correctly"
**Cause:** API key restrictions or billing not enabled
**Fix:** 
- Check API key restrictions in Google Cloud Console
- Enable billing (Google provides $200 free credit monthly)
- Verify APIs are enabled

### Map shows wrong location
**Cause:** Geocoding failed for destination
**Fix:** 
- Use more specific destination names
- Include "Metro Manila" or "Philippines" in search
- Check Geocoding API is enabled

### Console errors about quota
**Cause:** API usage limits exceeded
**Fix:**
- Check usage in Google Cloud Console
- Enable billing for higher limits
- Implement request caching (future enhancement)

## Cost Considerations

### Free Tier (Monthly)
- **Maps JavaScript API:** $200 credit = ~28,000 map loads
- **Geocoding API:** $200 credit = ~40,000 requests
- **Places API:** $200 credit = varies by request type

### For Development
- Free tier is MORE than enough
- No credit card required for testing with restrictions
- Monitor usage in Google Cloud Console

### For Production
- Enable billing (required)
- Set up budget alerts
- Implement caching strategies
- Consider usage quotas

## Alternative Solutions

If you want to avoid Google Maps costs:

1. **OpenStreetMap (Free)**
   - Use Leaflet.js library
   - Completely free
   - Good for basic mapping

2. **Mapbox (Free Tier)**
   - 50,000 free map loads/month
   - Modern styling
   - Good documentation

3. **Static Maps**
   - Show destination name only
   - Link to Google Maps web
   - Zero API costs

## Implementation Details

### Current Features
- ✅ Destination geocoding
- ✅ Marker with animation
- ✅ Info window with trip details
- ✅ Map controls (zoom, fullscreen)
- ✅ Fallback UI for errors
- ✅ Responsive design

### Future Enhancements
- [ ] Multiple markers for itinerary stops
- [ ] Route drawing between locations
- [ ] Distance/duration calculations
- [ ] Nearby places suggestions
- [ ] Street view integration
- [ ] Custom map styling

## Support

For Google Maps API issues:
- Documentation: https://developers.google.com/maps/documentation
- Support: https://developers.google.com/maps/support

For MNLXPLORE issues:
- Check console for detailed errors
- Verify .env.local configuration
- Ensure frontend server restarted after env changes

---

**Made with ❤️ by MNLXPLORE Team**
