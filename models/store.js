const mongoose = require('mongoose');
const addressSchema = require('./address');

module.exports = mongoose.model('Store', new mongoose.Schema({
  userId:  {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  name: { type: String, required: true },
  email: { type: String, required: true },
  description: String,
  dateCreated: { type: Date, default: new Date() },
  verified: { type: Boolean, default: false },
  suspended: { type: Boolean, default: false },
  address: addressSchema,
  category: String,
  logo: String,
  phone: String,
  banner: String
}));