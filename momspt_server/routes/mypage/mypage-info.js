const path = require('path');
const fs = require('fs');

const AWS = require('aws-sdk');
require('dotenv').config({path:__dirname+ '../..'+'.env'});

var db = require("../../database/models");
var Workout = db.workout;
var WorkoutSet = db.workout_set;
var HistoryPtPlan = db.history_pt_plan;
var User = db.user;
var HistoryWorkout = db.history_workout;
var HistoryBodyType = db.history_body_type;
var BodyType = db.body_type;
var HistoryWeight = db.history_weight;


let userController = require('../user/controller');
let getUserDday = userController.getUserDday;




exports.mypageInfomation = async (req,res) =>{
    
    //user table에 babyName하고 Thumbnail이 들어가야 함. 
    const user = await User.findOne({where:{id:req.query.id}});
    const today = Date.now();
    let dayAfterBabyDue = millisecondtoDay(Date.now() - user.babyDue);
    dayAfterBabyDue = Math.floor(dayAfterBabyDue);

    const sendResult =  {
        nickname:user.nickname,
        babyName:user.babyName,
        dayAfterBabyDue:dayAfterBabyDue,
        thumbnail:user.thumbnail
    }

    res.status(200).send(sendResult);
}

exports.setProfile = async (req,res)=> {

    const prefix = 'http://d29r6pfiojlanv.cloudfront.net/profile/';
    const s3 = new AWS.S3({
        accessKeyId:process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region:'ap-northeast-2'
    });

    // request 는 video
	console.log(req.body.id);

    console.log(req.file);
    console.log(req.file.path);
    
    var filePath = path.join(__dirname, '../..', 'uploads' ,req.file.filename);
    console.log(filePath);

    var param = {
        'Bucket':'momsptbucket',
        'Key':'profile/' + req.file.originalname,
        'ACL':'public-read',
        'Body':fs.createReadStream(filePath),
        'ContentType':'image/png'
    }
    
    
    s3.upload(param, function(err, data){
        if(err) {
            console.log(err);
        }
        console.log(data);
    });

    fs.access(filePath, fs.constants.F_OK, (err)=>{
        if(err) return console.log('삭제 불가능 파일');

        fs.unlink(filePath, (err)=> err?
        console.log(err) : console.log(`${filePath}를 정상적으로 삭제하였습니다.`));    
   });
   
    res.status(201).send({profile:prefix+req.file.originalname});
}

function UTCToKST(date){
    var koreaDate = date.getTime() -1*date.getTimezoneOffset()*60*1000;
    date.setTime(koreaDate);
    return date;
  }
  
  function millisecondtoDay(milli){
    return milli/(1000*3600*24);
  }
  