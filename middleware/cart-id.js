const Cart = require('../models/cart');

module.exports = (req, res, next) => {
  const cartId = req.body.cartId || req.params.id;
  // retrieve cart in database
  Cart.findOne({_id: cartId})
    .then(cart => {
      // if no cart was found return 
      if (!cart) {
        return res.status(400).json({message: `Cart with _id: ${cartId} not found.`});
      } else {
        // save cart on res.locals 
        res.locals.cart = cart;
        // pass execution to next function
        next();
      }
    }).catch(error => {
      if (error.name === 'CastError') 
        return res.status(400).json({message: `Invalid Cart ID: ${cartId}`});
      return res.status(500).json(error);
    });
};