const express = require('express');
const router = express.Router();
const dailyData = require('./day');
const monthlyData = require('./month');

router.get('/day/test',dailyData.test);
router.get('/');

module.exports = router;