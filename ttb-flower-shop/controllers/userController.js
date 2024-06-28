const User = require('../models/user');

// Controller to view a specific user profile
exports.viewProfile = (req, res) => {
    const userId = req.user.userId;
    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).send('User not found.');
            }
            res.json(user);
        })
        .catch(err => res.status(500).send('Error retrieving user: ' + err.message));
};

// Controller to list users
exports.listUsers = (req, res) => {
    User.find({})
        .then(users => res.json(users))
        .catch(err => res.status(500).send('Error retrieving users: ' + err.message));
};

// Controller to delete a user
exports.deleteUser = (req, res) => {
    const userId = req.body.userId;
    User.findByIdAndDelete(userId)
        .then(result => {
            if (!result) {
                return res.status(404).send('User not found.');
            }
            res.send('User deleted successfully.');
        })
        .catch(err => res.status(500).send('Error deleting user: ' + err.message));
};
