const Store = require('../models/store');
const User = require('../models/user');

exports.getAllStores = (req, res, next) => {
  Store.find({})
    .then(stores => res.status(200).json({stores: stores}))
    .catch(error => res.status(500).json(error));
};

exports.createStore = (req, res, next) => {
  // ensures that at least name and email, are provided
  if (!(req.body.name)) 
    return res.status(401).json({message: 'Please provide a valid name'});
  else if (!(req.body.email))
    return res.status(401).json({message: 'Please provide a valid email'});

  // retrieve the user from res.locals set in userId middleware
  const user = res.locals.user;

  // ensure that the user is of admin type else return 
  if (user.userType !== 'ADMIN') {
    return res.status(401).json({message: 'Only ADMIN users can create stores'});
  }

  // create the store
  const store = new Store({
    userId: user._id,
    name: req.body.name,
    email: req.body.email,
    description: req.body.description || '',
    address: req.body.address || {
      street: '',
      state: 1, 
      city: '', 
      zipcode: '', 
      country: ''
    },
    category: req.body.category || '',
    logo: req.body.logo || req.body.name.toLowerCase(),
    phone: req.body.phone || '',
    banner: req.body.banner || req.body.name.toUpperCase()
  });

  // save the store and return it
  store.save()
    .then(() => res.status(201).json({
      message: 'Store successfully created',
      store: store 
    })).catch(error => res.status(500).json(error));
};

exports.getStore = (req, res, next) => {
  res.status(200).json(res.locals.store);
};

exports.updateStore = async (req, res, next) => {
  // obtain store from res.locals
  const store = res.locals.store;

  // check and ensure that there is something to be updated in the store from request body
  if (!(req.body.userId || req.body.name || req.body.email || req.body.description
   || req.body.verified || req.body.suspended || req.body.address || req.body.category 
   || req.body.logo || req.body.phone || req.body.banner)) { 
    return res.status(401).json({
      message: 'Please provide valid userId, name, email, description, verified, suspended, address, category, logo, phone or banner to update with'
    });
  }
    
  if (req.body.userId) {
    // handle user transfers   
    let user;
    try {
      user = await User.findOne({_id: req.body.userId});
    } catch {
      return res.status(500).json(error);
    }
    // check if no user was found and return 
    if (!user) {
      return res.status(400).json({
        message: `Can't update the owner of the store with store _id: ${req.params.id} because no user with userId: ${req.body.userId} was not found.`
      });
    } else { 
      // ensure that the user is of admin type else return 
      if (user.userType !== 'ADMIN') {
        return res.status(401).json({message: `Cannot transfer ownership of this store to user with userId: ${req.body.userId} because they are not an ADMIN`});
      } else {
        store.userId = user._id;
      }
    }
  }

  // update with the provided body data
  if (req.body.name) store.name = req.body.name;
  if (req.body.email) store.email = req.body.email;
  if (req.body.description) store.description = req.body.description;
  if (req.body.verified) store.verified = req.body.verified;
  if (req.body.suspended) store.suspended = req.body.suspended;
  if (req.body.address) store.address = req.body.address;
  if (req.body.category) store.category = req.body.category;
  if (req.body.logo) store.logo = req.body.logo;
  if (req.body.phone) store.phone = req.body.phone;
  if (req.body.banner) store.banner = req.body.banner;

  // save the updated store and return it 
  store.save().then(updated => {
    res.status(201).json({
      message: 'Update Successful',
      store: updated
    });
  }).catch(error => res.status(500).json(error));
};

exports.deleteStore = (req, res, next) => {
  res.locals.store.delete()
    .then(() => res.status(204).end())
    .catch(error => res.status(500).json(error));
};