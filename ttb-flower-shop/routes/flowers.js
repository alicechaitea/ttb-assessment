const express = require('express');
const router = express.Router();
const { uploadFlower, listFlowers } = require('../controllers/flowerController');

router.post('/upload', uploadFlower);
router.get('/list', listFlowers);

module.exports = router;
