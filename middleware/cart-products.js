const Product = require('../models/product');

module.exports = (req, res, next) => {
  // ensure that there is products in request body
  if (!(req.body.products)) 
    return res.status(401).json({message: 'Please provide the products to be added to this Cart'});
  else if (!Array.isArray(req.body.products))
    return res.status(401).json({message: 'products in request body should be an Array'});
  else if (req.method == 'POST' && req.body.products.length < 1) 
    return res.status(401).json({message: 'At least one product must be added to a new cart'})
  else if (req.method == 'PUT' && req.body.products.length == 0) {
    res.locals.products = [];
    next();
  }
  else {
    // create new array of products for reference after iteration
    const products = [];
    // iterate over products 
    req.body.products.forEach((product, index) => {
      let position = index == 0 ? 'st' : index == 1 ? 'nd' : index == 2 ? 'rd' : 'th';
      // ensure there is quantity attached to the product, else return
      if (!(product.quantity)) 
        return res.status(401).json({
          message: `The ${index + 1}${position} product of the products array in request body does not have a quantity. Please provide a numeric quantity to each product`
        });
      else if (isNaN(product.quantity))
        return res.status(401).json({
          message: `The quantity of ${index + 1}${position} product of the products array in request body is not a number. Please ensure that the quantity of each product is a number`
        });
      else if (product.quantity < 1)
        return res.status(401).json({
          message: `The quantity of ${index + 1}${position} product of the products array in request body is less than one. Please ensure that the quantity of each product is at least one.`
        });
      else {
        const quantity = product.quantity;
        // retrieve products in database
        Product.findOne({_id: product._id})
          .then(product => {
            // if no product was found return 
            if (!product) {
              return res.status(400).json({message: `The ${index + 1}${position} product of the products array in request body with _id: ${product._id} was not found.`});
            } else {
              // add quantity to the product
              product.quantity = quantity;
              // save the product to the return array of products
              products.push(product);
            }
          }).catch(error => {
            if (error.name === 'CastError') 
              return res.status(400).json({message: `Invalid Product _id: ${product._id} at the ${index + 1}${position} product of the products array in request body`});
            return res.status(500).json(error);
          });
      }
    });
    // add the products array to res.locals
    res.locals.products = products;
    // pass execution to next function
    (new Promise(resolve => setTimeout(resolve, 5000))).then(next);
  }
};