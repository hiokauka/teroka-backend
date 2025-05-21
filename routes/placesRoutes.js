const express = require('express');
const router = express.Router();
const { fetchPlaces } = require('../controllers/placesController');

router.get('/', fetchPlaces); // e.g. /api/places?query=cafe&location=3.1390,101.6869

module.exports = router;
