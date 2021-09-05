const router = require('express').Router()
const workout = require('./workout')
const planManage = require('./plan-manage')

router.post('/todayworkoutlist', workout.getTodayWorkoutList);
router.get('/getinfo', workout.getInfo);
router.post('/sendresult', workout.sendResult);
router.get('/getjson', workout.getJson);

router.post('/weeklyworkoutstatistics',workout.weeklyWorkoutStatistics);

module.exports = router
