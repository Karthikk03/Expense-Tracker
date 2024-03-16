const express = require('express');
const router = express.Router();

const authorize = require('../Controllers/authorize');
const reportController = require('../Controllers/reports');

router.get('/download', authorize, reportController.download);
router.get('/', authorize, reportController.getReports);

module.exports = router;
