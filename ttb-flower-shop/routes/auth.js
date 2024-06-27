const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Add this route to verify token
router.post('/verifyToken', authController.verifyToken);

module.exports = router;
