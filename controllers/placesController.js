const { getPlaces } = require('../services/googlePlacesService');

const fetchPlaces = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const places = await getPlaces(query);
    res.json({ places });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch places from Google Places API' });
  }
};

module.exports = { fetchPlaces };
