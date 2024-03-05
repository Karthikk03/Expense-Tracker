const express = require('express');
const router = express.Router();

const authorize = require('../Controllers/authorize');
const forgotPassword = require('../Controllers/forgot');

router.post('/forgot', forgotPassword);

module.exports = router;
