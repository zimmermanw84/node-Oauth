var express = require('express');
var router = express.Router();
// var models = require('../models/users');
var User = require('../models/users');
/* GET home page. */

// Simple auth
var authUser = function(req, res, next) {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    next();
  }
};

router.get('/', function(req, res, next) {
  // console.log("User MODEL", models);
  res.render('index', { title: 'Express' });
});

router.get('/success', function(req, res, next) {
  res.render('success', {
    username: req.user.username,
    email: req.user.email,
    googleID: req.user.googleID,
    img: req.user.img
  });
});


module.exports = router;
