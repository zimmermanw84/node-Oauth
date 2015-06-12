var express = require('express');
var router = express.Router();
var User = require('../models/users');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


router.get('/users', function(req, res, next) {
  // Will send JSON for fun. Not really needed.
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

router.post('/google', function(req, res) {

});

// Would totally make session routes for REST convention. Just playing around
router.post('/users/logout', function(req, res) {
  req.session = null;
  res.redirect('/');
});

module.exports = router;
