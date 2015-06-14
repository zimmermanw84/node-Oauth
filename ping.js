var yelpConfig = require("./config/auth").yelpAuth;

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
      console.log("Name: ", data.businesses[i].image_url);
    }
  }
  catch(e) {
      console.log("ERROR", e);
  }
};

var apiCall = function(term, location, callback) {
  yelp.search({term: 'restaurants ' + term, location: location}, function(error, data) {
    // if (error) throw "API ERROR!: " + console.log(error);
    callback(data);
  });
};

for (place in LOCATIONS) {
  for (stuff in TERMS) {
    setTimeout(function() {
      apiCall(stuff, place, apiLogger);
    }, 1000)
  }
};
