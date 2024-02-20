const express = require('express');
const router = express.Router();

const authorize = require('../Controllers/authorize');
const premiumController = require('../Controllers/premium');

router.get('/isPremium',authorize,premiumController.checkPremium);
router.get('/purchase', authorize, premiumController.purchase);
router.post('/updatePayment',authorize,premiumController.updatePayment);

module.exports = router;
