require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const weatherRoutes = require('./routes/weatherRoutes');
const distanceRoutes = require('./routes/distanceRoutes');
const placesRoutes = require('./routes/placesRoutes');


app.use(cors());

app.get('/', (req, res) => {
    res.send('API is running...');
  });

app.use(express.json());

//weather api
app.use('/api', weatherRoutes);

//calculate distance api
app.use('/api', distanceRoutes);

//explore
app.use('/api/places', placesRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
