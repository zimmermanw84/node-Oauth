// load all the things we need

// load up the user model
var User = require('../models/users');

// load the auth variables
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var googleAuth = require('../config/auth').googleAuth;
var refresh = require('passport-oauth2-refresh');

module.exports = function(passport) {
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))
    // code for facebook (use('facebook', new FacebookStrategy))
    // code for twitter (use('twitter', new TwitterStrategy))

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    var gStrategy = new GoogleStrategy({
        clientID : googleAuth.clientID,
        clientSecret : googleAuth.clientSecret,
        callbackURL : googleAuth.callbackURL,
    },
    function(token, refreshToken, profile, done) {
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            User.findOne({ 'googleID' : profile.id }, function(err, user) {
                if (err) return done(err);

                if (user) {
                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isn't in our database, create a new user
                    var newUser = new User({
                      googleID: profile.id,
                      googleToken: token,
                      googleRefreshToken: refreshToken,
                      username:profile.displayName,
                      email: profile.emails[0].value,// pull the first email
                      img: profile.photos[0].value // store first picture url
                    });

                    // save the user
                    newUser.save(function(err) {
                        if (err) throw err;
                        return done(null, newUser);
                    });
                }
            });
        });

    });

    passport.use(gStrategy);
    refresh.use(gStrategy);

};
