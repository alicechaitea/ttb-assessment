const User = require('../models/user');

// Controller to list all users
exports.listUsers = (req, res) => {
    User.find({})
        .then(users => {
            console.log('Users fetched:', users);
            res.json(users);
        })
        .catch(err => {
            console.error('Error retrieving users:', err);
            res.status(500).send('Error retrieving users: ' + err.message);
        });
};

// Controller to view a specific user profile
exports.viewProfile = (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).send('User not found.');
            }
            res.json(user);
        })
        .catch(err => res.status(500).send('Error retrieving user: ' + err.message));
};

// Controller to update a specific user profile
exports.updateProfile = (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send('User not found.');
            }
            res.json(user);
        })
        .catch(err => res.status(500).send('Error updating user: ' + err.message));
};

// Controller to delete a user
exports.deleteUser = (req, res) => {
    const userId = req.body.userId;
    User.findByIdAndDelete(userId)
        .then(() => res.send('User deleted successfully!'))
        .catch(err => res.status(500).send('Error deleting user: ' + err.message));
};

exports.deleteUser = (req, res) => {
    const userId = req.body.userId;
    console.log('Deleting user with ID:', userId);  // Add this line for debugging
    User.findByIdAndDelete(userId)
        .then(() => res.send('User deleted successfully!'))
        .catch(err => {
            console.error('Error deleting user:', err);
            res.status(500).send('Error deleting user: ' + err.message);
        });
};
