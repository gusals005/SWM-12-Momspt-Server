const fs = require('fs');
const db = require("../../database/models");
const { DATA_NOT_MATCH, DATA_NOT_EXIST } = require('../jsonformat');
const { kakaoAuthCheck, getUserDday, todayKTC, findBodyType, DEFAULT_BODY_TYPE} = require('../utils');
const User = db.user;
const Workout = db.workout;
const HistoryWorkout = db.history_workout;
const HistoryBodyType = db.history_body_type;
const PtPlanData = db.pt_plan_data;
const WorkoutType = db.workout_type;
const WorkoutEffect = db.workout_effect;
const Video = db.video;
const Sequelize = require('sequelize');

const AWS = require('aws-sdk');
const { response } = require('express');
require('dotenv').config({path:__dirname+ '../..'+'.env'});

/* GET home page. */

// 오늘의 운동 리스트 API
exports.getTodayWorkoutList = async (req, res) => {

	const kakaoId = await kakaoAuthCheck(req);
    if( kakaoId < 0 ){
        res.status(401).json(KAKAO_AUTH_FAIL);
    }

	let result = await getWorkoutList(kakaoId, todayKTC());
	res.status(200).json(result);
}

exports.getDayWorkoutList = async (req,res) => { 
	const kakaoId = await kakaoAuthCheck(req);
    if( kakaoId < 0 ){
        res.status(401).json(KAKAO_AUTH_FAIL);
    };

	let targetDay = await convertSteptoDay(req.body.step, req.body.day);
	const user = await User.findOne({where:{kakaoId:kakaoId}});
	let babyDue = user.babyDue;
	let targetDate = new Date(babyDue.setDate(babyDue.getDate() + targetDay));
	
	const workoutList = await getWorkoutList(kakaoId, targetDate);
	res.status(200).json(workoutList);
}	

// 운동 상세 정보 얻기 API
exports.getInfo = async (req, res) => {

	const kakaoId = await kakaoAuthCheck(req);
    if( kakaoId < 0 ){
        res.status(401).json(KAKAO_AUTH_FAIL);
    }

	let workout = await Workout.findOne({ attributes: ['id','name', 'workoutCode' ,'explanation','calorie','playtime','thumbnail', 'videoCode','ai'], where : {workoutCode:req.query.workoutcode}});
	console.log(workout.dataValues);
	workout = await mergeVideoInfo(workout);
	workout = await mergeWorkoutType(workout);
	workout = await mergeWorkoutEffect(workout);

	if( workout == null){
		res.status(400).json(DATA_NOT_MATCH);
	}

	res.status(200).send(workout);
}

exports.sendResult = async (req,res) => {
	
	const kakaoId = await kakaoAuthCheck(req);
    if( kakaoId < 0 ){
        res.status(401).json(KAKAO_AUTH_FAIL);
    }

	const user = await getUserDday(kakaoId,new Date(req.body.date));
	
    if ( !user.id <0){
        res.status(400).json(DATA_NOT_MATCH);
    }
	
	const searchTargetRows = await HistoryWorkout.findAll({where: {user_id:user.id, date:user.targetDay, workout_id:req.body.workout_id}});
	//FOR DEBUG
	//console.log(searchTargetRows.length);

	if(searchTargetRows.length == 0 ){
		//create new record
		let maxId = await HistoryWorkout.findOne({ attributes: [[Sequelize.fn('MAX', Sequelize.col('id')), 'id']] });
		const insertRecored = await HistoryWorkout.create({id:maxId.id+1, user_id:user.id, date:user.targetDay, workout_id:req.body.workout_id, pause_time:0, score:req.body.score})
	}
	else{
		//update code
		const updateRecord = await HistoryWorkout.update({score:req.body.score}, {where: {user_id:user.id, date:user.targetDay, workout_id:req.body.workout_id}});
		//console.log("[LOG] updateScore: ",updateScore);
	}

	const workoutList = await getWorkoutList(kakaoId, new Date(req.body.date));
	let nextWorkout = null
	for( let workout of workoutList){
		if (workout.dataValues.history == null){
			nextWorkout = workout;
			break;
		}
	}
	res.status(200).send({success:true, message:'정상적으로 운동 결과를 저장했습니다.', nextWorkout: nextWorkout});
	
}

exports.getJson = async (req,res) => {

	const kakaoId = await kakaoAuthCheck(req);
    if( kakaoId < 0 ){
        res.status(401).json(KAKAO_AUTH_FAIL);
    }

    const s3 = new AWS.S3({
        accessKeyId:process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region:'ap-northeast-2'
    });


	let param = {
        'Bucket':'momsptbucket',
        'Key':'json/' + req.query.workoutcode + '.json',
    }

	let json;

	s3.getObject(param, function(err,data){
		if(err){
			console.log('[LOG]ERROR', err);
			res.status(400).send(DATA_NOT_EXIST);
		}
			
		else{
			//console.log(data.Body.toString());
			json = data.Body.toString();
			res.status(200).send(json);
		} 
	});
	
}

exports.weeklyWorkoutStatistics = async (req,res) => {

	const kakaoId = await kakaoAuthCheck(req);
    if( kakaoId < 0 ){
        res.status(401).json(KAKAO_AUTH_FAIL);
    }

	//오늘이 출산일 이후 며칠인지 계산.
	let today = todayKTC();
	let dayOfweek = today.getDay();

	const sunday = new Date(today.setDate(today.getDate() - dayOfweek));
	const userInfoSunday = await getUserDday(kakaoId, sunday);

	//FOR DEBUG
	//console.log(sunUserDday.targetDay, satUserDday);

	let sendResult = [];
	let idx=1;
	for(let i = 0; i< 7; i++){
		let dayResult = {};
		let total = 0;
		let done = 0;
		
		let nowDate = new Date(today.setDate(today.getDate() + i));
		let nowTargetDay = userInfoSunday.targetDay + i;
		
		// total workout Number
		let workoutIdList = [];

		const bodyTypeIdList = await findBodyType(userInfoSunday.id, nowDate);
	
		for(let bodyTypeId of bodyTypeIdList){
			let workoutList = await PtPlanData.findAll({where:{body_type_id:bodyTypeId, workout_date: nowTargetDay}});
			for(let workout of workoutList){
				workoutIdList.push(workout.workout_id);
			}
		}
		
		total = workoutIdList.length;
		//console.log('total', total);

		// done workout number
		const dayWorkoutHistory = await HistoryWorkout.findAll({ where:{user_id:userInfoSunday.id, date:nowTargetDay} })
										.catch((err)=>{	console.log(err); });
		
		done = dayWorkoutHistory.length;

		dayResult.order = idx++;
		dayResult.done = done;
		dayResult.totalWorkout = total;
		sendResult.push(dayResult);
	}

	console.log("[LOG] weeklyResult : ", sendResult);
	
	res.status(200).send(sendResult);
}


exports.getWorkoutList = getWorkoutList;

async function getWorkoutList(kakaoId, date){
	const user = await getUserDday(kakaoId, date);
    if ( !user.id <0){
        res.status(400).json(DATA_NOT_MATCH);
    }
	
	let workoutIdList = [];
	let result = [];
	const bodyTypeIdList = await findBodyType(user.id, date);

	for(let bodyTypeId of bodyTypeIdList){
		let workoutList = await PtPlanData.findAll({where:{body_type_id:bodyTypeId, workout_date: user.targetDay}});
		for(let workout of workoutList){
			workoutIdList.push(workout.workout_id);
		}
	}
	
	for(let workoutId of workoutIdList){
		let nowWorkout = await Workout.findOne({where:{id:workoutId}});
		nowWorkout = await mergeWorkoutData(nowWorkout, user.id, user.targetDay);
		result.push(nowWorkout);
	}
	
	return result;
}

async function mergeWorkoutData(workout, userId, userTargetDay){
	workout = await mergeVideoInfo(workout);
	workout = await mergeWorkoutType(workout);
	workout = await mergeWorkoutEffect(workout);
	workout = await mergeWorkoutHistory(workout, userId, userTargetDay);

	return workout;
}

async function mergeVideoInfo(workout){

	let videoInfoList = await Video.findAll({where:{videoCode:workout.videoCode}});

	let videoCheckTime = [];
	for ( let video of videoInfoList){
		videoCheckTime.push({workoutStartTime:video.workoutStartTime, workoutFinishTime:video.workoutFinishTime});
	}

	workout.dataValues.video = videoInfoList[0].url
	workout.dataValues.videoCheckTime = videoCheckTime;

	return workout;
}

async function mergeWorkoutType(workout){
	let result  = [];

	let typeList = await WorkoutType.findAll({attributes:['type'], where:{workout_id:workout.id}});

	for( let typeData of typeList){
		result.push(typeData.type);
	}

	workout.dataValues.type = result;

	return workout;
}

async function mergeWorkoutEffect(workout){
	let result  = [];

	let effectList = await WorkoutEffect.findAll({attributes:['effect'], where:{workout_id:workout.id}});

	for( let effectData of effectList){
		result.push(effectData.effect);
	}

	workout.dataValues.effect = result;

	return workout;
}

async function mergeWorkoutHistory(workout, userId, userTargetDay){
	let workoutHistory = await HistoryWorkout.findOne({ attributes:['score', 'pause_time'], where:{user_id:userId, date:userTargetDay, workout_id:workout.id}});

	workout.dataValues.history = workoutHistory;

	return workout;
}

async function convertSteptoDay(step, day){
	let stepStartDay = [1,8,31,51,101];
	return stepStartDay[step-1] + parseInt(day)-1;
}
