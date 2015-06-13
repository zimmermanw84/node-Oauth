var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
// For using multiple Oauth platforms would create nested attributes of each Oauth domain
// ex. user.google.username ; user.facebook.username ; ect.
  username: { type: String, required: true , unique: true },
  email: String,
  googleToken: String,
  googleID: Number,
  img: String

}));