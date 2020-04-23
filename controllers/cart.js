const Cart = require('../models/cart');

exports.createCart = (req, res, next) => {
  // obtain user, store and product from cart
  const user = res.locals.user;
  const store = res.locals.store;
  const products = res.locals.products;

  // get return products
  const returnProducts = [];
  products.forEach(product => returnProducts.push({
    productId: product._id,
    storeId: store._id,
    name: product.name,
    quantity: product.quantity,
    price: product.price
  }));

  // make the cart 
  const cart = new Cart({
    userId: user._id,
    products: returnProducts
  });

  // save and return 
  cart.save().then(() => res.status(201).json({
    message: 'Cart successfully created',
    cart: cart
  })).catch(error => res.status(500).json(error));
};

exports.getCart = (req, res, next) => {
  res.status(200).json(res.locals.cart);
};

exports.updateCart = (req, res, next) => {
  // NOTE: ownership of cart cannot be changed, instead create a new cart with the same products

  // get products and cart from res.locals set in middleware
  let cart = res.locals.cart;
  const products = res.locals.products;

  /*
    if an command with remove action is detected in the body then products of detected _ids are removed accordingly
    the expected Schema for command is 
    command: { action: String, product: _id} 
    if action is 'EMPTY', then the cart is emptyied, send an empty array in products
    if action is 'REMOVE', then the products with _id is removed
    if action is 'ADD', then the products in request body are added to this cart
  */
  if (req.body.command) {
    switch (req.body.command.action) {
      case 'EMPTY':
        cart.products = [];
        break;
      case 'ADD': 
        const addProducts = [];
        products.forEach(product => addProducts.push({
          productId: product._id,
          storeId: product.storeId,
          name: product.name,
          quantity: product.quantity,
          price: product.price
        }));
        cart.products = cart.products.concat(addProducts);
        break;
      case 'REMOVE':
        Cart.update({_id: cart._id}, {"$pull": {"products": {"_id": req.body.command.product._id}}}, 
            {safe: true, multi: true})
          .then(updated => {
            return res.status(201).json({message: 'Update Successful', cart: updated})
          }).catch(error => res.status(500).json(error));
        break;
      default: 
        return res.status(401).json({message: "Command not understood. Command should be 'EMPTY', 'ADD' or 'REMOVE'"});
    }
  } else {
  /*
    if no command is found
    if empty products array is sent, then the cart is emptied
    if a products array is sent, then the products are added 
  */
    if (products.length == 0) {
      cart.products = [];
    } else {
      const addProducts = [];
      products.forEach(product => addProducts.push({
        productId: product._id,
        storeId: product.storeId,
        name: product.name,
        quantity: product.quantity,
        price: product.price
      }));
      cart.products = cart.products.concat(addProducts);
    }
  }  

  // save updated cart and return
  cart.save().then(updated => res.status(201).json({
    message: 'Update Successful',
    cart: updated
  })).catch(error => res.status(500).json(error));
};

exports.deleteCart = (req, res, next) => {
  res.locals.cart.delete()
    .then(() => res.status(204).end())
    .catch(error => res.status(500).json(error));
};