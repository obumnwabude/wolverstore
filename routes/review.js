const router = require('express').Router();
const reviewCtrl = require('../controllers/review');
const auth = require('../middleware/auth');
const userId = require('../middleware/user-id');
const storeId = require('../middleware/store-id');
const orderId = require('../middleware/order-id');

router.post('/', userId, productId, storeId, auth, reviewCtrl.createReview);
router.get('/', userId, auth, reviewCtrl.getAllReviews);

module.exports = router;