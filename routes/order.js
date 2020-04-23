const router = require('express').Router();
const orderCtrl = require('../controllers/order');
const auth = require('../middleware/auth');
const userId = require('../middleware/user-id');
const storeId = require('../middleware/store-id');
const cartId = require('../middleware/cart-id');
const orderId = require('../middleware/order-id');
const userEmail = require('../middleware/user-email');

router.post('/', cartId, userId, auth, orderCtrl.createOrder);
router.get('/', userId, auth, orderCtrl.getAllOrders);
router.get('/:id', orderId, userEmail, auth, orderCtrl.getOrder);
router.put('/:id', orderId, userEmail, auth, orderCtrl.updateOrder);
router.delete('/:id', orderId, userEmail, auth, orderCtrl.updateOrder);

module.exports = router;