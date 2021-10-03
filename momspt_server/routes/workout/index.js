const router = require('express').Router();
const workout = require('./workout');

router.get('/workoutlist', workout.getTodayWorkoutList);
router.post('/workoutlist', workout.getDayWorkoutList)
router.get('/workoutinfo', workout.getInfo);
router.post('/workoutresult', workout.sendResult);
router.get('/keypoints', workout.getJson);

router.get('/weeklyworkoutstatistics',workout.weeklyWorkoutStatistics);

module.exports = router
