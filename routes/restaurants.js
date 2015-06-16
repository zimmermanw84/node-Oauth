var express = require('express');
var passport = require('passport');
var router = express.Router();
var Restaurant = require('../models/restaurants');

router.get('/restaurants', function(req, res, next) {

  Restaurant.find({}, function(err, rest) {
    var restMap = {};

    rest.forEach(function(rest) {
      restMap[rest._id] = rest;
    });

    res.send( JSON.stringify(restMap) );
  });
});

module.exports = router;