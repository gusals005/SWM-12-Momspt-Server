const express = require('express');
const router = express.Router();
const dailyData = require('./day');
const monthlyData = require('./month');

router.get('/day/test',dailyData.test);
router.post('/day/todayanalysis', dailyData.todayAnalysis);
router.post('/day/weeklystatistics',dailyData.weeklyStatistics);

router.get('/month/monthlystatistics',monthlyData.monthlyStatistics);
router.post('/month/detailstatistics', monthlyData.detailStatistics);

module.exports = router;