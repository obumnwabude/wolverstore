const mongoose = require('mongoose');

const imageSchema = {
  thumbnail: String,
  front: String,
  back: String,
  left: String,
  right: String,
  up: String,
  down: String
};

module.exports = mongoose.model('Product', new mongoose.Schema({
  storeId:  {type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true},
  name: { type: String, required: true},
  dateCreated: { type: Date, default: new Date() },
  price: {type: Number, required: true},
  discountPrice: Number,
  description: {type: String, required: true},
  images: imageSchema,
  category: String,
  inStock: {type: Number, required: true},
  variations: Array
}));