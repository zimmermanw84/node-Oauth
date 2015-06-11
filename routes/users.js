var express = require('express');
var router = express.Router();
var User = require('../models/users');
/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/users', function(req, res) {
  console.log("INSIDE POST USERS!", req.body);
  var user = new User({
    username: req.body.username,
  });

  console.log("USER", user);

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
  res.redirect('/');
});

module.exports = router;
