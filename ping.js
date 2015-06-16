var yelpConfig = require("./config/auth").yelpAuth;
var mongoose = require('mongoose');
var Restaurant = require('./models/restaurants');
var http = require('http');

mongoose.connection.on('connected', function() {
  console.log('CONNECTED');
})

mongoose.connect('mongodb://127.0.0.1:27017/nodeOauth');

var gracefulExit = function() {
  mongoose.connection.close(function () {
    console.log('\nMongoose default connection with DB is disconnected through app termination');
    process.exit(0);
  });
};

process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

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
    }
  }
  catch(e) {
      console.log("ERROR", e);
  }
};

var scrape = function(data) {
  // var newRest;
  // console.log("DATA", data);
  try {
    for (var i = 0; i < data.businesses.length; i++) {

      var rest = new Restaurant({
        name: data.businesses[i].name,
        phone: data.businesses[i].phone,
        rating: data.businesses[i].rating,
        snippetText: data.businesses[i].snippet_text,
        imageUrl: data.businesses[i].image_url
      });

      rest.save(function(err, rest) {
        if (err) console.log(err);
        console.log("REST", rest);
      });
    }
  } catch(e) { console.log("ERROR", e); }
};

var apiCall = function(term, location, callback, logger) {
  yelp.search({term: 'restaurants ' + term, location: location}, function(error, data) {
    if (error) console.log(error);

    try {
        callback(data);
      // logger(data);
    } catch(e) { console.log("ERROR: ", e) }
  });
};

// Make API call to yelp
var go = function() {
  for (var place in LOCATIONS) {
    for (var stuff in TERMS) {
      apiCall(stuff, place, scrape, apiLogger);
    }
  }
};

// GET all USERS from ec2
var getUsers = function() {

  var options = {
    host: '52.26.126.153',
    port: 80,
    path: '/users'
  };


  var req = http.get(options, function(response) {
    console.log("STATUS: ", response.statusCode);
    response.setEncoding('utf8');
    response.on("data", function(chunk) {
      console.log("Response BODY: ", chunk);
    });
  }).on('error', function(err) {
    console.log("ERROR: ", err);
  });

  req.end();
};

getUsers();
// go();