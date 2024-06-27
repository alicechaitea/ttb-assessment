const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

module.exports = (upload) => {
    // Middleware to authenticate JWT
    const authenticateJWT = (req, res, next) => {
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            console.error('No token provided');
            return res.status(401).send('Access denied');
        }

        try {
            const verified = jwt.verify(token, 'your_jwt_secret');
            req.user = verified;
            next();
        } catch (err) {
            console.error('Invalid token:', err.message);
            res.status(400).send('Invalid token');
        }
    };

    // GridFSBucket instance
    let gfs;
    mongoose.connection.once('open', () => {
        gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'uploads'
        });
    });

    // Endpoint to upload flower photo
    router.post('/upload', authenticateJWT, upload.single('photo'), (req, res) => {
        console.log('File received:', req.file);
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        res.json({ message: 'Photo uploaded successfully!', file: req.file.filename });
    });

    // Endpoint to get all photos
    router.get('/photos', authenticateJWT, (req, res) => {
        gfs.find().toArray((err, files) => {
            if (err) {
                return res.status(500).json({ message: 'An error occurred', error: err });
            }
            if (!files || files.length === 0) {
                return res.status(404).json({ message: 'No photos found' });
            }
            res.json(files);
        });
    });

    // Endpoint to get a single photo by filename
    router.get('/photos/:filename', authenticateJWT, (req, res) => {
        gfs.find({ filename: req.params.filename }).toArray((err, files) => {
            if (err) {
                console.error('Error finding file:', err);
                return res.status(500).json({ message: 'An error occurred', error: err });
            }
            if (!files || files.length === 0) {
                console.error('No file found with filename:', req.params.filename);
                return res.status(404).json({ message: 'No file found' });
            }
            const readStream = gfs.openDownloadStreamByName(req.params.filename);
            readStream.on('error', (error) => {
                console.error('Error opening download stream:', error);
                res.status(500).send('Error opening download stream');
            });
            res.set('Content-Type', files[0].contentType);
            readStream.pipe(res);
        });
    });

    return router;
};
