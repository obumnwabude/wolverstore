const Store = require('../models/store');

module.exports = (req, res, next) => {
  // where to get the id from
  let storeId;
  if (res.locals.product != undefined) storeId = res.locals.product.storeId;
  else if (req.body.storeId) storeId = req.body.storeId;
  else storeId = req.params.id;
  // retrieve store in database
  Store.findOne({_id: storeId})
    .then(async store => {
      // if no store was found return 
      if (!store) {
        return res.status(400).json({message: `Store with _id: ${storeId} not found.`});
      } else {
        // save store on res.locals 
        res.locals.store = store;
        // pass execution to next function
        next();
      }
    }).catch(error => {
      if (error.name === 'CastError') 
        return res.status(400).json({message: `Invalid Store ID: ${storeId}`});
      return res.status(500).json(error);
    });
};