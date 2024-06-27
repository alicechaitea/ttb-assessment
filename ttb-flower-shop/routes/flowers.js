const express = require('express');
const router = express.Router();
const flowerController = require('../controllers/flowerController');

router.post('/add', flowerController.addFlower);
router.post('/update', flowerController.updateFlower);

module.exports = router;
