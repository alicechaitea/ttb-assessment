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

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Import routes
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const flowerRoutes = require('./routes/flowers');

// Use routes
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/flowers', flowerRoutes);

// Serve home.html as the default page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
