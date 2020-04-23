const mongoose = require('mongoose');

const productSchema = {
  productId: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
  storeId: {type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true},
  name: {type: String, required: true},
  quantity: {type: Number, required: true},
  price: {type: Number, required: true}
};

module.exports = mongoose.model('Cart', new mongoose.Schema({
  userId:  {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  dateCreated: { type: Date, expires: 86400, default: new Date() },
  products: {type: [productSchema]}
}));

