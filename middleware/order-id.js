const Order = require('../models/order');

module.exports = (req, res, next) => {
  Order.findOne({_id: req.params.id})
    .then(order => {
      if (!order) {
        return res.status(400).json({message: `Order with order _id: ${req.params.id} not found.`});
      } else {
        res.locals.order = order;
        next();
      }
    })
    .catch(error => {
      if (error.name === 'CastError') 
        return res.status(400).json({message: `Invalid Order ID: ${req.params.id}`});
      else 
        return res.status(500).json(error);
    });
};