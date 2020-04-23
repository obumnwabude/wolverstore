const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const Logger = require('./models/logger');
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/user');
const storeRoutes = require('./routes/store');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const port = process.env.PORT || 3000;

// connect to mongodb
mongoose.connect('mongodb+srv://obum:24PFP3g7v6idbhcM@cluster0-kfvs4.gcp.mongodb.net/ecxbackend-wolverstore', 
  {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('Successfully connected to MongoDB!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB!');
    console.error(error);
  });

// accept body data
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// a logger to save logs to database
const logStream = { 
  write: line => {
    const logger = new Logger({log: line});
    logger.save().catch(err => console.log(err));
  }
};

// morgan middleware for logging
app.use(morgan(':method :url :status :response-time ms', {stream: logStream}));

app.use('/', indexRoutes);
app.use('/user', userRoutes);
app.use('/store', storeRoutes);
app.use('/product', productRoutes);
app.use('/cart', cartRoutes);

module.exports = app.listen(port);