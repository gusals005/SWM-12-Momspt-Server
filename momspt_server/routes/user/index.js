const router = require('express').Router()
const controller = require('./controller')
const userInfo = require('./user-information')


router.get('/', controller.test);
router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/nicknameduplicatecheck', controller.nicknameDuplicateCheck);

router.get('/getdaycomment', userInfo.getDayComment);

module.exports = router
