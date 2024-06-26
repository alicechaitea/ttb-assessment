const mongoose = require('mongoose');

const flowerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true }
});

module.exports = mongoose.model('Flower', flowerSchema);
