const Review = require('../models/review');

exports.createReview = (req, res, next) => {
  // get user, product and store from res.locals
  const user = res.locals.user;
  const product = res.locals.product;
  const store = res.locals.store;

  // ensure that a rating was provided 
  if (!req.body.rating) 
    return res.status(401).json({message: 'Please provide a rating'});
  else if (isNaN(req.body.rating))
    return res.status(401).json({message: 'rating must be a number'});
  else if (req.body.rating < 0.1 || req.body.rating > 5) 
    return res.status(401).json({message: 'rating must be between 1 to 5'});

  const review = new Review({
    productId: product._id,
    customer: {
      userId: user._id,
      firstName: user.name,
      lastName: user.name,
      email: user.email,
      phone: user.phone
    },
    store: {
      storeId: store._id,
      name: store.name
    },
    rating: Math.round(req.body.rating * 10) / 10
  });
  if (req.body.verified) {
    if ('boolean' == typeof req.body.verified) {
      review.verified = req.body.verified
    } else {
      return res.status(401).json({message: 'paid must be true or false'});
    }
  }

  review.save()
    .then(review => res.status(201).json({
      message: 'Review successfully created!',
      review: review
    })).catch(error => res.status(500).json(error));
};