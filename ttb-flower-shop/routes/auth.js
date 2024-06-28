const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verifyToken', authController.verifyToken);
router.get('/profile', authController.profile); // Add this route to get the profile

module.exports = router;
