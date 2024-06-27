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
