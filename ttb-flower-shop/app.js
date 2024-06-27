const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
const jwt = require('jsonwebtoken');

// Enable CORS if needed
app.use(cors());

mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public directory

// Import routes
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

// JWT middleware to protect routes
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

// Use routes
app.use('/users', authenticateJWT, userRoutes); // Protect user routes with JWT
app.use('/auth', authRoutes);

// Serve home.html as the default page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
