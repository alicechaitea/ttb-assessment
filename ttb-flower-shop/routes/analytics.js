const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Define a route for analytics
router.get('/data', analyticsController.getAnalytics);

module.exports = router;
