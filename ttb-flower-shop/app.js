const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const { GridFSBucket, ObjectId } = require('mongodb');

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

// GridFSBucket instance
let gfs;
mongoose.connection.once('open', () => {
    gfs = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
    });
    console.log('GridFSBucket initialized');

    // Define a route to list all photos
    app.get('/flowers/list', async (req, res) => {
        try {
            const files = [];
            const cursor = gfs.find();
            for await (const doc of cursor) {
                files.push(doc);
            }
            if (files.length === 0) {
                return res.status(404).json({ message: 'No photos found' });
            }
            res.json(files);
        } catch (err) {
            console.error('Error fetching files:', err);
            res.status(500).json({ message: 'Error fetching files' });
        }
    });

    // Define a route to download a photo by filename
    app.get('/flowers/download/:filename', (req, res) => {
        const { filename } = req.params;
        const readStream = gfs.openDownloadStreamByName(filename);
        readStream.on('error', (error) => {
            console.error('Error reading file from GridFS:', error);
            res.status(500).send('Error reading file');
        });
        readStream.pipe(res);
    });

    // Define a route to serve photo files
    app.get('/flowers/photos/:filename', (req, res) => {
        const { filename } = req.params;
        const readStream = gfs.openDownloadStreamByName(filename);
        readStream.on('error', (error) => {
            console.error('Error reading file from GridFS:', error);
            res.status(500).send('Error reading file');
        });
        readStream.pipe(res);
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
