const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// load User model
const User = require('./models/User');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
            // match user
            User.findOne({ username: username }).select(["+password"]).then(user => {
                if (!user) {
                    return done(null, false, { errorMessage: 'That username is not registered' });
                }
                // match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) console.log(err)
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { errorMessage: 'Password incorrect' });
                    }
                });
            });
        })
    );

    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};