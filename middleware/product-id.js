const Product = require('../models/product');

module.exports = (req, res, next) => {
  // retrieve product in database
  Product.findOne({_id: req.params.id})
    .then(product => {
      // if no product was found return 
      if (!product) {
        return res.status(400).json({message: `Product with _id: ${req.params.id} not found.`});
      } else {
        // save product on res.locals 
        res.locals.product = product;
        // pass execution to next function
        next();
      }
    }).catch(error => {
      if (error.name === 'CastError') 
        return res.status(400).json({message: `Invalid Product ID: ${req.params.id}`});
      return res.status(500).json(error);
    });
};