const User = require('../models/user'); // Assuming the User model is correctly defined

// Controller to list all users
exports.listUsers = (req, res) => {
    User.find({})
        .then(users => res.json(users))
        .catch(err => res.status(500).send('Error retrieving users: ' + err.message));
};

// Controller to delete a user
exports.deleteUser = (req, res) => {
    const userId = req.body.userId;
    User.findByIdAndRemove(userId)
        .then(() => res.send('User deleted successfully!'))
        .catch(err => res.status(500).send('Error deleting user: ' + err.message));
};
