var User = require('../models/user');
var jwt = require('jsonwebtoken');

// Examples
exports.example = function(req, res) {
    res.send('respond with a resource');
};

// New user
exports.signup = function (req, res) {
    // Get User from request
    let email = req.body.email;
    let username = email.substring(0, email.lastIndexOf("@"));
    let password = req.body.password;
    let age = req.body.age;
    let gender = req.body.gender;

    // New user object
    let user = new User ({
        email: email,
        username: username,
        password: password,
        age: age,
        gender: gender,
    });

    // Saving into db
    user.save(function (err, saved) {
        if (err) {
            res.json({
                success: false,
                error: "Someone already taken this email address."
            })
        }

        if (saved) {
            // if OK sends true
            res.json({
                success: true,
                id: user._id,
            })
        }
    })
};

// Login user
exports.login = function (req, res) {
    // Find the user
    User.findOne({ email: req.body.email }).then(function (user, err) {
        if (err) {
            res.json({
                success: false,
                error: "Database error"
            })
        }

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' })
        }

        else if (user) {
            // Check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (err) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                }

                if (isMatch) {
                    // If user is found and password is right
                    // create a token with only our given payload
                    const payload = {
                        id: user._id,
                        email: user.email
                    };

                    let token = jwt.sign(payload, process.env.JWT_SECRET, {
                        expiresIn: 60 * 60 * 24
                    });

                    // Return the information including token as JSON
                    res.json({
                        success: true,
                        id: user._id,
                        token: token
                    })
                }
            })
        }
    }).catch(function (err) {
        console.log(err)
    })
};