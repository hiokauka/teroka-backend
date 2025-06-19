require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");

// MongoDB Atlas URI from .env
const uri = process.env.MONGO_URI

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const weatherRoutes = require('./routes/weatherRoutes');
const distanceRoutes = require('./routes/distanceRoutes');
const placesRoutes = require('./routes/placesRoutes');
const userRoutes = require("./routes/userRoutes");
const favouriteRoutes = require('./routes/favouriteRoutes');
const carbonHistoryRoutes = require('./routes/carbonHistoryRoutes'); 
const itineraryRoutes = require('./routes/itineraryRoutes');
const postRoutes = require('./routes/postRoutes'); 
const authRoutes = require('./routes/authRoutes');

app.use('/uploads', express.static('uploads')); 

// Use Routes
app.use("/users", userRoutes);
app.use('/api', weatherRoutes);
app.use('/api', distanceRoutes);
app.use('/places', placesRoutes);
app.use('/favorites', favouriteRoutes);
app.use('/carbonhistory', carbonHistoryRoutes);
app.use('/itineraries', itineraryRoutes);
app.use('/posts', postRoutes)
app.use('/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// MongoDB connection
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected!"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
