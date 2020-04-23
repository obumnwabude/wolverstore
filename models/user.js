const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const addressSchema = require('./address');

module.exports = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  password: { type: String, required: true },
  userType: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER'
  },
  dateCreated: { type: Date, default: new Date() },
  lastLogin: { type: Date, default: new Date() },
  verified: { type: Boolean, default: false },
  addresses: [addressSchema]
}).plugin(uniqueValidator));
