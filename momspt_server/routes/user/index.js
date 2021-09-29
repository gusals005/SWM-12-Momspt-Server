const router = require('express').Router()
const controller = require('./controller')
const userInfo = require('./user-information')

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.get('/nicknameduplicate', controller.nicknameDuplicateCheck);

router.get('/daycomment', userInfo.getDayComment);

module.exports = router
