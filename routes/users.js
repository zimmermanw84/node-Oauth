var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/users');

router.get('/users', function(req, res, next) {
  // Will send JSON for fun. Not really needed. Just for testing
  // console.log('AUTH TOKENS', googleInfo);
  console.log("PROCESS", process.nextTick);
  res.send('respond with a resource');
});

router.post('/users', function(req, res) {

  var user = new User({
    username: req.body.username,
  });

  user.save(function(err) {
    if (err) {
      var error = "Broken! Please try again!";

      if (err.code === 11000) {
        error = "Email is already taken, please try another!";
      }
      res.send(error);
    } else {
      req.session.user = user;
      res.redirect('/success');
    }
  });
});

// Would totally make session routes for REST convention. Just playing around
router.post('/users/logout', function(req, res) {
  req.session = null;
  req.logout();
  res.redirect('/');
});

// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
router.post('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'],approvalPrompt: 'force' }
));

// the callback after google has authenticated the user
router.get('/auth/google/callback',
  passport.authenticate('google', { successRedirect : '/success', failureRedirect : '/' })

);


module.exports = router;
