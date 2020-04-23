const router = require('express').Router();
const reviewCtrl = require('../controllers/review');
const auth = require('../middleware/auth');
const userId = require('../middleware/user-id');
const storeId = require('../middleware/store-id');
const orderId = require('../middleware/order-id');

router.post('/', userId, productId, storeId, auth, reviewCtrl.createReview);
router.get('/', userId, auth, reviewCtrl.getAllReviews);
router.get('/:id', reviewId, userId, auth, reviewCtrl.getReview);
router.put('/:id', reviewId, userId, auth, reviewCtrl.updateReview);
router.delete('/:id', reviewId, userId, auth, reviewCtrl.deleteReview)

module.exports = router;