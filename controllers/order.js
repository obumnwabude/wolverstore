const Order = require('../models/order');
const Store = require('../models/store');

exports.createOrder = async (req, res, next) => {
  // if there's no shipping address in body, return
  if (!(req.body.shippingAddress))
    return res.status(401).json({message: 'Please provide the shippingAddress'});

  // get cart and user from res.locals set in middleware
  const cart = res.locals.cart;
  const user = res.locals.user;

  // ensure only normal users can make orders else return 
  if (user.userType !== 'USER') {
    return res.status(401).json({message: 'Only normal users can make orders'});
  }

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
      userId: user._id,
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

exports.getAllOrders = (req, res, next) => {
  Order.find({'customer.userId': res.locals.user._id})
    .then(orders => res.status(200).json({orders: orders}))
    .catch(error => res.status(500).json(error));
};

exports.getOrder = (req, res, next) => {
  res.status(200).json({order: res.locals.order});
};

exports.updateOrder = (req, res, next) => {
  // NOTE: Only the shippingAddress, paid and status attributes can be updated in an order

  // check if none of the above where provided, return if so
  if (!(req.body.shippingAddress || req.body.paid || req.body.status)) 
    return res.status(401).json({message: 'Please provide a shippingAddress, paid or status to update with'});

  // get the order to be updated from res.locals
  const order = res.locals.order;

  // ensure paid is boolean else return 
  if (req.body.paid) {
    if ('boolean' == typeof req.body.paid) {
      order.paid = req.body.paid
    } else {
      return res.status(401).json({message: 'paid must be true or false'});
    }
  }

  // ensure status is one of the enum strings 
  if (req.body.status) {
    if (req.body.status === 'Sent' || req.body.status === 'In-transit' || req.body.status === 'Delivered') {
      order.status = req.body.status;
    } else {
      return res.status(401).json({message: "status on order can only be 'Sent', 'In-transit' or 'Delivered'"});
    }
  }

  // update shippingAddress if available 
  if (req.body.shippingAddress) order.shippingAddress = req.body.shippingAddress;

  // save and return order
  order.save().then(updated => {
    res.status(201).json({
      message: 'Update Successful',
      order: updated
    });
  }).catch(error => res.status(500).json(error));
};

exports.deleteOrder = (req, res, next) => {
  res.locals.order.delete()
    .then(() => res.status(204).end())
    .catch(error => res.status(500).json(error));
};
