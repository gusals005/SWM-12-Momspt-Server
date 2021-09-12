const express = require('express');
const router = express.Router();
const mypageInfo = require('./mypage-info');
const multer = require('multer');
const upload = multer({dest:'uploads/'});

router.get('/info', mypageInfo.mypageInfomation);
router.post('/profile', upload.single('file'),mypageInfo.setProfile);

module.exports = router;