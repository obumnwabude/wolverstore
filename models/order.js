const mongoose = require('mongoose');
const addressSchema = require('./address');
const customerSchema = require('./customer');

module.exports = mongoose.model('Order', new mongoose.Schema({
  cartId: {type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true},
  referenceId: {type: String, required: true},
  customer: {type: customerSchema, required: true},
  date: {type: Date, default: new Date()},
  shippingAddress: {type: addressSchema, required: true},
  status: {
    type: String,
    enum: ['Sent', 'In-transit', 'Delivered'],
    default: 'Sent'
  },
  paid: {type: Boolean, default: false}
}));