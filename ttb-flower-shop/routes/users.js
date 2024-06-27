const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send('Access denied');
    }

    try {
        const verified = jwt.verify(token, 'your_jwt_secret');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};

// Route to list all users
router.get('/list', userController.listUsers);

// Route to view a specific user profile
router.get('/profile', authenticateJWT, userController.viewProfile);

// Route to update a specific user profile
router.post('/profile/:id', authenticateJWT, userController.updateProfile);

// Route to handle user deletion
router.post('/delete', authenticateJWT, userController.deleteUser);

module.exports = router;
