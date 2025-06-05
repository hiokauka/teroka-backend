const express = require('express');
const router = express.Router();
const Itinerary = require('../models/itinerary');
const { v4: uuidv4 } = require('uuid');


//=================
//add place 
//=================
router.post('/add-place', async (req, res) => {
  const { userEmail, startDate, endDate, dayNumber, place } = req.body;

  try {
    // 1. Find user's itinerary
    let itinerary = await Itinerary.findOne({ userEmail });

    if (!itinerary) {
      // 2. Create a new itinerary if none exists
      itinerary = new Itinerary({
        userEmail,
        startDate,
        endDate,
        days: [
          {
            day: dayNumber,
            places: [place]
          }
        ]
      });
    } else {
      // 3. Find the day in the itinerary
      let day = itinerary.days.find(d => d.day === dayNumber);
      if (!day) {
        // Add new day if it doesn't exist
        itinerary.days.push({ day: dayNumber, places: [place] });
      } else {
        // 4. Check if the place already exists for the day
        const placeExists = day.places.some(p => p.name === place.name);

        if (placeExists) {
          return res.status(400).json({ message: 'Place already added for this day' });
        }

        // 5. If not duplicate, add the place
        day.places.push(place);
      }
    }

    // 6. Save itinerary
    const saved = await itinerary.save();
    res.status(200).json(saved);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get itinerary by userEmail
router.get('/', async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail) return res.status(400).json({ message: "Missing userEmail query parameter" });

    const itinerary = await Itinerary.findOne({ userEmail });
    if (!itinerary) return res.status(404).json({ message: "Itinerary not found" });

    res.json(itinerary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all itineraries
router.get('/all', async (req, res) => {
  try {
    const itineraries = await Itinerary.find();
    res.json(itineraries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove place from itinerary
router.put('/remove-place', async (req, res) => {
  const { userEmail, dayNumber, placeName } = req.body;

  if (!userEmail || dayNumber === undefined || !placeName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const itinerary = await Itinerary.findOne({ userEmail });

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    // Find the day
    const day = itinerary.days.find(d => d.day === dayNumber);
    if (!day) {
      return res.status(404).json({ message: `Day ${dayNumber} not found` });
    }

    // Filter out the place to remove
    const initialLength = day.places.length;
    day.places = day.places.filter(p => p.name !== placeName);

    if (day.places.length === initialLength) {
      // No place was removed
      return res.status(404).json({ message: `Place "${placeName}" not found on day ${dayNumber}` });
    }

    // Save updated itinerary
    await itinerary.save();

    res.status(200).json({ message: `Place "${placeName}" removed from day ${dayNumber}` });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
