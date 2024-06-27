const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');

const app = express();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000' // Adjust to the correct origin of your front-end
}));

mongoose.connect('mongodb://localhost:27017/yourDatabaseName')
.then(() => {
    console.log('MongoDB connected successfully');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public directory

// Create a GridFsStorage object
const storage = new GridFsStorage({
    url: 'mongodb://localhost:27017/yourDatabaseName',
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads' // collection name in MongoDB
            };
            resolve(fileInfo);
        });
    }
});

const upload = multer({ storage });

// Import routes
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const flowerRoutes = require('./routes/flowers')(upload);

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

// GridFSBucket instance
let gfs;
mongoose.connection.once('open', () => {
    gfs = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
    });
    console.log('GridFSBucket initialized');
});
