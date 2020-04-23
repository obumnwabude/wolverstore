const User = require('../models/user');

module.exports = (req, res, next) => {
  const userEmail = res.locals.order.customer.email;
  User.findOne({email: userEmail})
    .then(user => {
      if (!user) {
        return res.status(400).json({message: `User with email: ${userEmail} not found`});
      } else {
        res.locals.user = user;
        next();
      }
    }).catch(error => {
      return res.status(500).json(error); 
    });
};