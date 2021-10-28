const router = require('express').Router()
const controller = require('./controller')
const userInfo = require('./user-information')
const multer = require('multer');
const upload = multer({dest:'uploads/'});

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.delete('/withdrawal',  controller.withdrawal);
router.get('/nicknameduplicate', controller.nicknameDuplicateCheck);
router.get('/daycomment', userInfo.getDayComment);

router.post('/bodyshape', upload.single('file'), controller.bodyTypeGlb);


module.exports = router
