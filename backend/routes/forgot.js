const express = require('express');
const router = express.Router();

const authorize = require('../Controllers/authorize');
const passwordRoutes = require('../Controllers/forgot');

router.post('/forgot', passwordRoutes.forgot);

router.get('/resetpassword/:uuid',passwordRoutes.reset)

router.post('/update/:uuid',passwordRoutes.update)

module.exports = router;
