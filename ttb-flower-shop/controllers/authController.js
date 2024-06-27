const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Register function remains the same
exports.register = (req, res) => {
    const { citizenId, firstName, lastName, mobile, email, username, password } = req.body;
    const newUser = new User({ citizenId, firstName, lastName, mobile, email, username, password });
    newUser.save()
        .then(() => res.send('User registered successfully!'))
        .catch(err => res.status(500).send('Error registering user: ' + err.message));
};

// Login function remains the same
exports.login = (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username: username })
        .then(user => {
            if (!user) {
                return res.status(400).json({ message: 'Invalid username or password' });
            }

            // Validate password
            if (password !== user.password) {
                return res.status(400).json({ message: 'Invalid username or password' });
            }

            // Generate a JWT token
            const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

            res.json({ message: 'Login successful', token: token });
        })
        .catch(err => res.status(500).json({ message: 'Error logging in: ' + err.message }));
};

// Add verifyToken function
exports.verifyToken = (req, res) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.json({ valid: false });
    }

    try {
        jwt.verify(token, 'your_jwt_secret');
        res.json({ valid: true });
    } catch (err) {
        res.json({ valid: false });
    }
};
