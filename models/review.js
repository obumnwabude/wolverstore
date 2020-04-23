const mongoose = require('mongoose');

const customerSchema = {
  firstName: String,
  lastName: String,
  phone: String,
  email: String
};

const storeSchema = {
  storeId: {type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true},
  name: {type: String, required: true}
};

module.exports = mongoose.model('Review', new mongoose.Schema({
  productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true}, 
  customer: {type: customerSchema, required: true},
  verified: {type: Boolean, default: true},
  dateCreated: {type: Date, default: new Date()},
  rating: {type: Number, required: true},
  store: {type: storeSchema, required: true}
}));