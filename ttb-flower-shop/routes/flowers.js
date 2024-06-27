const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Mongo URI
const mongoURI = 'mongodb://localhost:27017/yourDatabaseName';

// Create a storage object with GridFS
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return {
            bucketName: 'uploads', // collection name in MongoDB
            filename: file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        };
    }
});

// Set up multer for file uploads
const upload = multer({ storage });

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

// Endpoint to upload flower photo
router.post('/upload', authenticateJWT, upload.single('photo'), (req, res) => {
    res.json({ message: 'Photo uploaded successfully!', file: req.file });
});

// Endpoint to get all photos
router.get('/photos', authenticateJWT, (req, res) => {
    const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

    conn.once('open', () => {
        const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
            bucketName: 'uploads'
        });

        gfs.find().toArray((err, files) => {
            if (!files || files.length === 0) {
                return res.status(404).json({ message: 'No photos found' });
            }
            res.json(files);
        });
    });
});

// Endpoint to get a single photo by filename
router.get('/photos/:filename', authenticateJWT, (req, res) => {
    const conn = mongoose.createConnection(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

    conn.once('open', () => {
        const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
            bucketName: 'uploads'
        });

        gfs.find({ filename: req.params.filename }).toArray((err, files) => {
            if (!files || files.length === 0) {
                return res.status(404).json({ message: 'No file found' });
            }

            gfs.openDownloadStreamByName(req.params.filename).pipe(res);
        });
    });
});

module.exports = router;
