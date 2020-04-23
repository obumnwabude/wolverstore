const Order = require('../models/order');
const Store = require('../models/store');

exports.createOrder = async (req, res, next) => {
  // if there's no shipping address in body, return
  if (!(req.body.shippingAddress))
    return res.status(401).json({message: 'Please provide the shippingAddress'});

  // get cart and user from res.locals set in middleware
  const cart = res.locals.cart;
  const user = res.locals.user;

  // retrieve store from database to get store name
  let store;
  try {
    store = await Store.findOne({_id: cart.products[0].storeId});
  } catch (error) {
    res.status(500).json(error);
  }

  // make reference id
  const referenceId = store.name.substring(0, 3) + '-' + user.name.substring(0, 3) + '-' + 
    (new Date()).toJSON();

  // create the order
  const order = new Order({
    cartId: res.locals.cart._id,
    referenceId: referenceId,
    customer: {
      firstName: user.name,
      lastName: user.name,
      email: user.email,
      phone: user.phone
    },
    shippingAddress: req.body.shippingAddress 
  });
  if (req.body.status) {
    if (req.body.status === 'Sent' || req.body.status === 'In-transit' || req.body.status === 'Delivered') {
      order.status = req.body.status;
    } else {
      return res.status(401).json({message: "status on order can only be 'Sent', 'In-transit' or 'Delivered'"});
    }
  }
  if (req.body.paid) {
    if ('boolean' == typeof req.body.paid) {
      order.paid = req.body.paid
    } else {
      return res.status(401).json({message: 'paid must be true or false'});
    }
  }

  // save the order and return it
  order.save()
    .then(() => res.status(201).json({
      message: 'Order successfully created',
      order: order 
    })).catch(error => res.status(500).json(error));
};