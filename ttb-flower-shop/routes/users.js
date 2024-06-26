const express = require('express');
const router = express.Router();
const { viewProfile, updateProfile } = require('../controllers/userController');

router.get('/profile', viewProfile);
router.post('/profile', updateProfile);

module.exports = router;
