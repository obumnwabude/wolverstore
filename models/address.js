const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  street: String,
  state: Number, 
  city: String, 
  zipcode: String, 
  country: String
});