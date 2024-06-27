const User = require('../models/user'); // Make sure the path to the User model is correct

exports.register = (req, res) => {
    const { citizenId, firstName, lastName, mobile, email, username, password } = req.body;
    const newUser = new User({ citizenId, firstName, lastName, mobile, email, username, password });
    newUser.save()
        .then(() => res.send('User registered successfully!'))
        .catch(err => res.status(500).send('Error registering user: ' + err.message));
};
