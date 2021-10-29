const router = require('express').Router()
const controller = require('./controller')
const userInfo = require('./user-information')
var multer = require('multer');	

//multer 의 diskStorage를 정의
var storage = multer.diskStorage({
  //경로 설정
  destination : function(req, file, cb){    
    cb(null, 'uploads/');
  },
  //실제 저장되는 파일명 설정
  filename : function(req, file, cb){
	//파일명 설정을 돕기 위해 요청정보(req)와 파일(file)에 대한 정보를 전달함
    //Multer는 어떠한 파일 확장자도 추가하지 않습니다. 
    //사용자 함수는 파일 확장자를 온전히 포함한 파일명을 반환해야 합니다.        
    var mimeType;

    switch (file.mimetype) {
        case "video/mp4":
            mimeType ="mp4"
            break;
        case "image/jpeg":
            mimeType = "jpg";
            break;
        case "image/png":
            mimeType = "png";
            break;
        case "image/gif":
            mimeType = "gif";
            break;
        case "image/bmp":
            mimeType = "bmp";
            break;
        default:
            mimeType = "png";
            break;
    }
    cb(null,  + '123213123' + "." + mimeType);
  }
});

var upload = multer({storage: storage});

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.delete('/withdrawal',  controller.withdrawal);
router.get('/nicknameduplicate', controller.nicknameDuplicateCheck);
router.get('/daycomment', userInfo.getDayComment);

router.post('/bodyshape', upload.single('file'), controller.bodyTypeGlb);


module.exports = router
