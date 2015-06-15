var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Restaurant', new Schema({
// For using multiple Oauth platforms would create nested attributes of each Oauth domain
// ex. user.google.username ; user.facebook.username ; ect.
  name: { type: String, required: true },
  phone: { type: String, required: true },
  rating: { type: String, required: true },
  snippetText: { type: String, required: true },
  imageUrl: { type: String, required: true },

}));
