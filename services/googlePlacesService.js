const axios = require('axios');

const getPlaces = async (query) => {
  const endpoint = 'https://maps.googleapis.com/maps/api/place/textsearch/json';

  const response = await axios.get(endpoint, {
    params: {
      query, // e.g. "park in Melaka"
      key: process.env.GOOGLE_API_KEY,
    }
  });

  return response.data.results.map(place => ({
    name: place.name,
    address: place.formatted_address,
    rating: place.rating,
    types: place.types,
    photo: place.photos && place.photos.length > 0
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${process.env.GOOGLE_API_KEY}`
      : null
  }));

};

module.exports = { getPlaces };
