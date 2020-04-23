const Review = require('../models/review');

module.exports = (req, res, next) => {
  Review.findOne({_id: req.params.id})
    .then(review => {
      if (!review) {
        return res.status(400).json({message: `Review with review _id: ${req.params.id} not found.`});
      } else {
        res.locals.review = review;
        next();
      }
    })
    .catch(error => {
      if (error.name === 'CastError') 
        return res.status(400).json({message: `Invalid Review ID: ${req.params.id}`});
      else 
        return res.status(500).json(error);
    });
};