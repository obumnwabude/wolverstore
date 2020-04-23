const Product = require('../models/product');
const Store = require('../models/store');

exports.getAllProducts = (req, res, next) => {
  Product.find({})
    .then(products => res.status(200).json({products: products}))
    .catch(error => res.status(500).json(error));
};

exports.createProduct = (req, res, next) => {
  // ensures that at least name, quantity, price, inStock and description, are provided
  if (!(req.body.name)) 
    return res.status(401).json({message: 'Please provide a valid name'});
  else if (!(req.body.price))
    return res.status(401).json({message: 'Please provide a valid price'});
  else if (!(req.body.description))
    return res.status(401).json({message: 'Please provide a valid description'});
  else if (!(req.body.inStock))
    return res.status(401).json({message: 'Please provide a valid inStock'});

  // check if numeric attributes are numbers else return
  // for price
  if (req.body.price) {
    if (isNaN(req.body.price)) {
      return res.status(401).json({message: 'The price must be a numeric value'});
    } else if (req.body.price < 1) {
      return res.status(401).json({message: 'The price must be greater than 0'});
    }
  }
  // for discountPrice
  if (req.body.discountPrice) {
    if (isNaN(req.body.discountPrice)) {
      return res.status(401).json({message: 'The discountPrice must be a numeric value'});
    } else if (req.body.discountPrice < 0) {
      return res.status(401).json({message: 'The discountPrice must be greater than or equal to 0'});
    }
  }
  // for inStock
  if (req.body.inStock) {
    if (isNaN(req.body.inStock)) {
      return res.status(401).json({message: 'The inStock must be a numeric value'});
    } else if (req.body.inStock < 1) {
      return res.status(401).json({message: 'The inStock must be greater than 0'});
    }
  }

  // create the product
  const product = new Product({
    storeId: res.locals.store._id,
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    discountPrice: req.body.discountPrice || 0,
    images: req.body.images || {
      thumbnail: '',
      front: '',
      back: '',
      left: '',
      right: '',
      up: '',
      down: ''
    },
    category: req.body.category || '',
    inStock: req.body.inStock,
    variations: req.body.variations || []
  });

  // save the store and return it
  product.save()
    .then(() => res.status(201).json({
      message: 'Product successfully created',
      product: product 
    })).catch(error => res.status(500).json(error));
};

exports.getProduct = (req, res, next) => {
  res.status(200).json(res.locals.product);
};

exports.updateProduct = async (req, res, next) => {
  // obtain product from res.locals
  const product = res.locals.product;

  // check and ensure that there is something to be updated in the store from request body
  if (!(req.body.storeId || req.body.name || req.body.description
   || req.body.price || req.body.discountPrice || req.body.images || req.body.category 
   || req.body.inStock || req.body.variations)) { 
    return res.status(401).json({
      message: 'Please provide valid storeId, name, email, description, price, discountPrice, images, category, inStock or variations to update with'
    });
  }

    // check if numeric attributes are numbers else return
  // for price
  if (req.body.price) {
    if (isNaN(req.body.price)) {
      return res.status(401).json({message: 'The price must be a numeric value'});
    } else if (req.body.price < 1) {
      return res.status(401).json({message: 'The price must be greater than 0'});
    } else product.price = req.body.price;
  }
  // for discountPrice
  if (req.body.discountPrice) {
    if (isNaN(req.body.discountPrice)) {
      return res.status(401).json({message: 'The discountPrice must be a numeric value'});
    } else if (req.body.discountPrice < 0) {
      return res.status(401).json({message: 'The discountPrice must be greater than 0'});
    } else product.discountPrice = req.body.discountPrice;
  }
  // for inStock
  if (req.body.inStock) {
    if (isNaN(req.body.inStock)) {
      return res.status(401).json({message: 'The inStock must be a numeric value'});
    } else if (req.body.inStock < 0) {
      return res.status(401).json({message: 'The inStock must be greater than 0'});
    } else product.inStock = req.body.inStock;
  }
    
  if (req.body.storeId) {
    // handle store transfers   
    let store;
    try {
      store = await Store.findOne({_id: req.body.storeId});
    } catch {
      return res.status(500).json(error);
    }
    // check if no store was found and return 
    if (!store) {
      return res.status(400).json({
        message: `Can't update the store that owns the product with product _id: ${req.params.id} because no store with storeId: ${req.body.storeId} was not found.`
      });
    } else { 
      product.storeId = store._id;
    }
  }

  // update with the provided body data
  if (req.body.name) product.name = req.body.name;
  if (req.body.description) product.description = req.body.description;
  if (req.body.images) product.images = req.body.images;
  if (req.body.category) product.category = req.body.category;
  if (req.body.variations) product.variations = product.variations.concat(req.body.variations);

  // save the updated product and return it 
  product.save().then(updated => {
    res.status(201).json({
      message: 'Update Successful',
      product: updated
    });
  }).catch(error => res.status(500).json(error));
};

exports.deleteProduct = (req, res, next) => {
  res.locals.product.delete()
    .then(() => res.status(204).end())
    .catch(error => res.status(500).json(error));
};