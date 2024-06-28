const express = require('express');
const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');
const jwt = require('jsonwebtoken');

module.exports = (upload) => {
    const router = express.Router();

    const mongoURI = 'mongodb://localhost:27017/yourDatabaseName';

    // Middleware to authenticate JWT
    const authenticateJWT = (req, res, next) => {
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).send('Access denied: No token provided');
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
        console.log('File received:', req.file);
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        console.log('File upload successful, sending response');
        res.json({ message: 'Photo uploaded successfully!', file: req.file.filename });
    });

    // Endpoint to fetch all photos
    router.get('/photos', authenticateJWT, (req, res) => {
        const db = mongoose.connection;
        const gfs = new mongoose.mongo.GridFSBucket(db.db, {
            bucketName: 'uploads'
        });

        gfs.find().toArray((err, files) => {
            if (err) {
                return res.status(500).send('Error fetching photos');
            }
            if (!files || files.length === 0) {
                return res.status(404).send('No photos found');
            }
            res.json(files);
        });
    });

    return router;
};
