const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
let gfs;

db.once('open', () => {
  console.log('MongoDB connected successfully');
  gfs = new mongoose.mongo.GridFSBucket(db.db, {
    bucketName: 'uploads',
  });

  // Define the filename you want to download
  const filename = 'photo-1719551720865.jpg';

  // Create a read stream from GridFS
  const readStream = gfs.openDownloadStreamByName(filename);

  // Define the local path where you want to save the file
  const localFilePath = path.join(__dirname, filename);

  // Create a write stream to the local file
  const writeStream = fs.createWriteStream(localFilePath);

  // Pipe the read stream to the write stream
  readStream.pipe(writeStream);

  // Handle events
  readStream.on('error', (error) => {
    console.error('Error reading file from GridFS:', error);
  });

  writeStream.on('error', (error) => {
    console.error('Error writing file to local storage:', error);
  });

  writeStream.on('finish', () => {
    console.log('File downloaded successfully to', localFilePath);
  });
});
