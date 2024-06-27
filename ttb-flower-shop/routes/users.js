const express = require('express');
const router = express.Router();
const { viewProfile, updateProfile } = require('../controllers/userController');

// Added :id to handle specific user profiles
router.get('/profile/:id', viewProfile);
router.post('/profile/:id', updateProfile);

module.exports = router;
