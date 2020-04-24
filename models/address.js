const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  street: String,
  state: String, 
  city: String, 
  zipcode: String, 
  country: String
});