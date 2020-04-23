const User = require('../models/user');

module.exports = (req, res, next) => {
  let userId;
  if (res.locals.cart != undefined) userId = res.locals.cart.userId;
  else if (res.locals.store != undefined) userId = res.locals.store.userId;
  else if (req.body.userId) userId = req.body.userId;
  else userId = req.params.id;
  // retrieve the user from the database 
  User.findOne({_id: userId})
    .then(user => {
      // check if there's no valid user with the provided id, return
      if (!user) {
        // if so return message that user with specified id was not found
        return res.status(400).json({message: `User with _id: ${userId}, not found!`});
      } else { 
        // assign the user to res.locals for access in next functions
        res.locals.user = user;
        // pass execution to next action
        next();
      }
    }).catch(error => {
      if (error.name === 'CastError') 
        return res.status(400).json({message: `Invalid User ID: ${userId}`});
      return res.status(500).json(error);
    });
};