const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    citizenId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true } // Consider using bcrypt to hash passwords
});

module.exports = mongoose.model('User', UserSchema);
