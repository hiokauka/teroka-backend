const express = require('express');
const router = express.Router();

const { calculateDistance } = require('../controllers/distanceController');

router.get('/distance', calculateDistance);

module.exports = router;
