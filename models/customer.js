const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  firstName: String,
  lastName: String,
  phone: String,
  email: String
});