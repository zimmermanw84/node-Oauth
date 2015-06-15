var yelpConfig = require("./config/auth").yelpAuth;
var mongoose = require('mongoose');
var Restaurant = require('./models/restaurants');
var http = require('http');

// mongoose.connect('mongodb://localhost/restaurants/');

var yelp = require("yelp").createClient({
  consumer_key: yelpConfig.consumerKey,
  consumer_secret: yelpConfig.consumerSecret,
  token: yelpConfig.token,
  token_secret: yelpConfig.tokenSecret
});

var LOCATIONS = {
  sf: "San Francisco",
  oak: "Oakland",
  sj: "San Jose",
  cn: "Concord",
  rich: "Richmond",
  fr: "Fremont",
  wc: "Walnut Creek"
};

var TERMS = {
  p: "pizza",
  i: "curry",
  ice: "ice cream",
  b: "burritos",
  bur: "burgers",
  chix: "chicken"
};

var apiLogger = function(data) {
  try {
    for (var i = 0; i < data.businesses.length; i++) {
      console.log("Name: ", data.businesses[i].name);
      console.log("Phone: ", data.businesses[i].phone);
      console.log("Rating: ", data.businesses[i].rating);
      console.log("Snippet: ", data.businesses[i].snippet_text);
      (data.businesses[i].image_url);
    }
  }
  catch(e) {
      console.log("ERROR", e);
  }
};

var scrape = function(data) {
  var newRest;
  var data = JSON.stringify(data);
  try {
    for (var i = 0; i < data.businesses.length; i++) {
      newRest = new Restaurant({
        name: data.businesses.name,
        phone: data.businesses.phone,
        rating: data.businesses.rating,
        snippetText: data.businesses.snippet_text,
        imageUrl: businesses.image_url
      });

      console.log("REST:", newRest);
      newRest.save(function(err, rest) {
        if (err) console.log(err);
        console.log("REST", rest);
      });
    }
  }
  catch(e) { console.log("ERROR", e); }
};

var apiCall = function(term, location, callback, logger) {
  yelp.search({term: 'restaurants ' + term, location: location}, function(error, data) {
    if (!data) return;

    try {
      callback(data);
      logger(data);
    } catch(e) { console.log("ERROR: ", e) }
  });
};

// Make API call to yelp
for (place in LOCATIONS) {
  for (stuff in TERMS) {
    apiCall(stuff, place, scrape, apiLogger);
  }
};

// GET all USERS from ec2
var getUsers = function() {

  var options = {
    host: '52.26.126.153',
    port: 80,
    path: '/users'
  };


  http.get(options, function(response) {
    console.log("STATUS: ", response.statusCode);
    response.setEncoding('utf8');
    response.on("data", function(chunk) {
      console.log("Response BODY: ", chunk);
    });
  }).on('error', function(err) {
    console.log("ERROR: ", err);
  });

}

// getUsers();