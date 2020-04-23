const router = require('express').Router();
const indexCtrl = require('../controllers/index');

router.get('/', indexCtrl.home);
router.get('/logs', indexCtrl.getLogs);

module.exports = router;