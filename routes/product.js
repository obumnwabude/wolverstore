const router = require('express').Router();
const productCtrl = require('../controllers/product');
const auth = require('../middleware/auth');
const userId = require('../middleware/user-id');
const storeId = require('../middleware/store-id');
const productId = require('../middleware/product-id');


router.get('/', productCtrl.getAllProducts);
router.post('/', storeId, userId, auth, productCtrl.createProduct);
router.get('/:id', productId, storeId, userId, auth, productCtrl.getProduct);
router.put('/:id', productId, storeId, userId, auth, productCtrl.updateProduct);
router.delete('/:id', productId, storeId, userId, auth, productCtrl.deleteProduct);

module.exports = router;