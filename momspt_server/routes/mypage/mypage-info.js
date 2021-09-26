const path = require('path');
const fs = require('fs');

const AWS = require('aws-sdk');
require('dotenv').config({path:__dirname+ '../..'+'.env'});

const db = require("../../database/models");
const Workout = db.workout;
const WorkoutSet = db.workout_set;
const HistoryPtPlan = db.history_pt_plan;
const User = db.user;
const HistoryWorkout = db.history_workout;
const HistoryBodyType = db.history_body_type;
const BodyType = db.body_type;
const HistoryWeight = db.history_weight;

const {kakaoAuthCheck, getUserDday, todayKTC} = require('../utils');
const { KAKAO_AUTH_FAIL, DATA_NOT_MATCH } = require('../jsonformat');

exports.mypageInfomation = async (req,res) =>{
    
    let kakaoId = await kakaoAuthCheck(req);

    if(kakaoId < 0){
        res.status(401).json(KAKAO_AUTH_FAIL);
    }
    
    const userInfo = await getUserDday(kakaoId,todayKTC());
    const user = await User.findOne({where:{id:userInfo.id}});
    if( user == null){
		res.status(400).json(DATA_NOT_MATCH);
	}

    let dayAfterBabyDue = millisecondtoDay(todayKTC() - user.babyDue);
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

    const kakaoId = await kakaoAuthCheck(req);
    if( kakaoId < 0 ){
        res.status(401).json(KAKAO_AUTH_FAIL);
    }

    const userInfo = await getUserDday(kakaoId,todayKTC());
    if ( !userInfo.id <0){
        res.status(400).json(DATA_NOT_MATCH);
    }
    
    const prefix = 'http://d29r6pfiojlanv.cloudfront.net/profile/';
    const s3 = new AWS.S3({
        accessKeyId:process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region:'ap-northeast-2'
    });

    // request 는 video
	// console.log(req.body.id);
    console.log(req.file);
    // console.log(req.file.path);
    
    let filePath = path.join(__dirname, '../..', 'uploads' ,req.file.filename);
    // console.log(filePath);

    let param = {
        'Bucket':'momsptbucket',
        'Key':'profile/' + req.file.filename + '.png',
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


    await User.update({thumbnail:prefix+req.file.filename}, {where: {id:userInfo.id}});
    res.status(201).send({profile:prefix+req.file.filename+'.png'});
}
  
function millisecondtoDay(milli){
    return milli/(1000*3600*24);
}
  