const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => { 
  // check the authorization for token matching
  try {
    // get the token from request headers
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'random');
    if (decodedToken.email === res.locals.user.email) {
      // pass execution to next action
      next();
    } else {
      throw new Error('Invalid Request');
    }
  } catch(error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({
        message: 'Session expired, please login again'
      });
    } else {
      return res.status(400).json({message: 'Invalid Request'});
    }
  }     
};