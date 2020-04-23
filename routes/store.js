const router = require('express').Router();
const storeCtrl = require('../controllers/store');
const auth = require('../middleware/auth');
const userId = require('../middleware/user-id');
const storeId = require('../middleware/store-id');

router.get('/', storeCtrl.getAllStores);
router.post('/', userId, auth, storeCtrl.createStore);
router.get('/:id', storeId, auth, storeCtrl.getStore);
router.put('/:id', storeId, auth, storeCtrl.updateStore);
router.delete('/:id', storeId, auth, storeCtrl.deleteStore);

module.exports = router;