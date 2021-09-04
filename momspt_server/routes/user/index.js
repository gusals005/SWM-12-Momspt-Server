const router = require('express').Router()
const controller = require('./controller')
const authMiddleware = require('../../middlewares/auth')

router.get('/', controller.test);


router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/nicknameduplicatecheck', controller.nicknameDuplicateCheck);
router.use('/check', authMiddleware);
router.get('/check', controller.check);

module.exports = router
