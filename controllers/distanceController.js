const axios = require('axios');

const calculateDistance = async (req, res) => {
    try {
        const origin = req.query.origin;
        const destination = req.query.destination;

        if (!origin || !destination) {
            return res.status(400).json({ error: 'Origin and destination are required' });
        }

        const apiKey = process.env.GOOGLE_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

        const response = await axios.get(url);
        const data = response.data;

        if (data.status !== 'OK') {
            return res.status(500).json({ error: 'Error from Google API', details: data.error_message });
        }


        // Extract distance info from response (adjust based on API response structure)
        const distanceInfo = data.rows[0]?.elements[0];
        if (distanceInfo.status !== 'OK') {
            return res.status(400).json({ error: 'Invalid route between origin and destination' });
        }

        const distanceText = distanceInfo.distance.text; // e.g., "12.3 km"
        const distanceValue = distanceInfo.distance.value; // meters

        res.json({ distanceText, distanceValue });
        
    } catch (error) {
        console.error('Error calculating distance:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { calculateDistance };
