const express = require('express');
const router = express.Router();
const dailyData = require('./day');
const monthlyData = require('./month');

router.get('/day/test',dailyData.test);
router.post('/day/todayanalysis', dailyData.todayAnalysis);
router.post('/day/weeklyweightstatistics',dailyData.weeklyWeightStatistics);

module.exports = router;