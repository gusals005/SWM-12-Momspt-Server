const fs = require('fs');
const db = require("../../database/models");
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const {DEFAULT_BODY_TYPE, X_Leg_BODY_TYPE, PELVICIMBALANCE_BODY_TYPE, Anterior_BODY_TYPE, Posterior_BODY_TYPE, ANTERIOR_BODY_TYPE, POSTERIOR_BODY_TYPE} = require('../utils');
const User = db.user;
const HistoryBodyType = db.history_body_type;
const HistoryWeight = db.history_weight;
const HistoryWorkout = db.history_workout;
const {kakaoAuthCheck, getUserDday, todayKTC} = require('../utils');
const axios = require('axios')
const path  = require('path')
const FormData = require('form-data');
const { response } = require('express');
const { NONAME } = require('dns');

const AWS = require('aws-sdk');
require('dotenv').config({path:__dirname+ '../..'+'.env'});
/**
 * 회원가입 API
 */ 
exports.signup = async (req,res) => {
	console.log(req.body)  
	const { kakaoId, nickname, babyDue, weightBeforePregnancy, weightNow, heightNow } = req.body;

	let user  = await User.findOne({attributes:{exclude:['id','createdAt','updatedAt']}, where:{kakaoId:kakaoId}});
	
	if( user == null){
		//User.destroy({ t	runcate: true, restartIdentity: true });
		let maxId = await User.findOne({ attributes: [[Sequelize.fn('MAX', Sequelize.col('id')), 'id']] }); 

		let newUser = await User.create({id:maxId.id+1, nickname:nickname,babyDue:babyDue, weightBeforePregnancy:weightBeforePregnancy, weightNow:weightNow, heightNow:heightNow, kakaoId:kakaoId, babyName:""});
		console.log('[LOG]NEW USER' + 'id : ' + newUser.id + ', nickname : ' + newUser.nickname);

		maxId = await HistoryBodyType.findOne({attributes: [[Sequelize.fn('MAX', Sequelize.col('id')), 'id']] });

		let newBodyHistory = await HistoryBodyType.create({id:maxId.id+1, user_id:newUser.id, body_type_id:DEFAULT_BODY_TYPE, createdAt:todayKTC()});
		console.log('[LOG]NEW Body History' + newBodyHistory.body_type_id);

		
		let targetDay = (todayKTC() - newUser.babyDue)/(1000*3600*24);
		targetDay = Math.floor(targetDay);
		console.log(targetDay)
		let newWeight = await HistoryWeight.create({id:maxId.id+1, user_id:newUser.id, weight:weightNow, date:targetDay, createdAt:todayKTC()})
										.catch((err)=>{	console.log(err);});

		const sendResult = {
			"message":"Success",
			"user":{
				"nickname":newUser.nickname,   
				"babyDue":newUser.babyDue,
				"weightBeforePregnancy":newUser.weightBeforePregnancy,
				"weightNow":newUser.weightNow,
				"heightNow":newUser.heightNow,
				"kakaoId":newUser.kakaoId		
			}
		}
		res.status(201).send(sendResult);
	}
	else{
		res.status(400).json({
			"success": false,
			"message": "해당 kakaoId를 가진 유저가 존재합니다."
		});
	}
}

exports.withdrawal = async(req, res)=>{
	const kakaoId = await kakaoAuthCheck(req);
    if( kakaoId < 0 ){
        res.status(401).json(KAKAO_AUTH_FAIL);
		return;
    }
	const user = await getUserDday(kakaoId,new Date(req.body.date));
	
	const deleteWeight = await HistoryWeight.destroy({where:{user_id:user.id}})
	const deleteBodyType = await HistoryBodyType.destroy({where:{user_id:user.id}})
	const deleteHistoryWorkout = await HistoryWorkout.destroy({where:{user_id:user.id}})
	const deleteUser = await User.destroy({where:{id:user.id}});
	res.status(200).send({success:true, message:'정상적으로 요청을 수행했습니다.'})
}

/**
 * 닉네임 중복 확인 API 
 */
exports.nicknameDuplicateCheck = async (req,res) => {
	const { nickname } = req.query;
	const user  = await User.findOne({where:{nickname:nickname}});
	if (user == null){
		res.status(200).json({success:true, message:"중복된 닉네임이 없습니다."});
	}
	else{
		res.status(400).json({success:false, message: '해당 닉네임를 가진 유저가 존재합니다.'}); 
	}
}

/**
 * 로그인 API
 * 카카오 인증만 사용할 경우, 사용하지 않을 수도 있음.
 * 자체 로그인이 필요할 때 사용
 */
exports.login = async (req,res) => {
	const { kakaoId } = req.body;
	// const secret = req.app.get('jwt-secret');
	//console.log(secret);

	const user  = await User.findOne({where:{kakaoId:kakaoId}});

	if( user == null){
		res.status(400).json({success:false, message: '해당 kakaoId를 가진 사용자가 없습니다.'});
		return;
	}

	// const token = await jwt.sign({
	// 	id: user.id
	// },
	// secret,
	// {
	// 	expiresIn: '1d',
	// 	subject: 'userInfo'
	// });
	const result = {
		success:true,
		user:user
	};
	res.send(result);
}


exports.bodyTypeGlb = async (req, res) => {
	// request 는 video
	console.log(req.file)
    
    var filePath = path.join(__dirname, '../..', 'uploads' ,req.file.filename);
	
	let formdata = new FormData();
	let filedata = fs.createReadStream(filePath);
	
	let result = {};
	formdata.append('file', filedata, req.file.filename);
	await axios.post('http://125.129.117.140:4500/upload',formdata,{
		headers:formdata.getHeaders()
	}).then(async function res(res){
		
		let {bodyComment, workoutComment} = shapeToStr(res.data.genuVarum, res.data.pelvicImbalance, res.data.pelvicTilt);
		result.bodyComment = bodyComment;
		result.workoutComment = workoutComment;
		result.glbURL = 'http://125.129.117.140:4500' + res.data.glbURL;

		let maxId = await HistoryBodyType.findOne({attributes: [[Sequelize.fn('MAX', Sequelize.col('id')), 'id']] });
		
		if(res.data.genuVarum == "O_Leg"){
			await HistoryBodyType.create({id:maxId.id+1, user_id:newUser.id, body_type_id:O_LEG_BODY_TYPE, createdAt:todayKTC()});
		}
		if(res.data.genuVarum == "X_Leg"){
			await HistoryBodyType.create({id:maxId.id+1, user_id:newUser.id, body_type_id:X_Leg_BODY_TYPE, createdAt:todayKTC()});
		}
		if(res.data.pelvicImbalance == "Left"){
			await HistoryBodyType.create({id:maxId.id+1, user_id:newUser.id, body_type_id:PELVICIMBALANCE_BODY_TYPE, createdAt:todayKTC()});
		}
		if(res.data.pelvicImbalance == "Right"){
			await HistoryBodyType.create({id:maxId.id+1, user_id:newUser.id, body_type_id:PELVICIMBALANCE_BODY_TYPE, createdAt:todayKTC()});
		}
		if(res.data.pelvicTilt == "Anterior"){
			await HistoryBodyType.create({id:maxId.id+1, user_id:newUser.id, body_type_id:ANTERIOR_BODY_TYPE, createdAt:todayKTC()});
		}
		if(res.data.pelvicTilt == "Posterior"){
			await HistoryBodyType.create({id:maxId.id+1, user_id:newUser.id, body_type_id:POSTERIOR_BODY_TYPE, createdAt:todayKTC()});
		}
		await HistoryBodyType.create({id:maxId.id+1, user_id:newUser.id, body_type_id:DEFAULT_BODY_TYPE, createdAt:todayKTC()});
		console.log(res.data)
		// return axios.get('http://125.129.117.140:4500' + res.data.glbURL)
	})
	.catch(err=>console.log(err))
	
	fs.access(filePath, fs.constants.F_OK, (err)=>{
        if(err) return console.log('삭제 불가능 파일');

        fs.unlink(filePath, (err)=> err?
        console.log(err) : console.log(`${filePath}를 정상적으로 삭제하였습니다.`));    
    });

	res.send(result);
}

function shapeToStr(genuVarum, pelvicImbalance, pelvicTilt){
	let bodyComment = ""
	let workoutComment = ""

	let pelvicTiltComment = ""
	let pelvicImbalanceComment = ""
	let genuVarumComment = ""

	if(pelvicTilt == "Anterior"){
		pelvicTiltComment = "전방경사"
	}else if(pelvicTilt == "Normal"){
		pelvicTiltComment = "정상"
	}else if(pelvicTilt == "Posterior"){
		pelvicTiltComment = "후방경사"
	}
	if(pelvicImbalance == "Left"){
		pelvicImbalanceComment = "좌측 상승"
	}else if(pelvicImbalance == "Normal"){
		pelvicImbalanceComment = "정상"
	}else if(pelvicImbalance == "Right"){
		pelvicImbalanceComment = "우측 상승"
	}

	if(genuVarum == "O_Leg"){
		genuVarumComment = "O다리"
	}else if(genuVarum == "Normal"){
		genuVarumComment = "정상"
	}else if(genuVarum == "X_Leg"){
		genuVarumComment = "우측 상승"
	}

	bodyComment = '척추에 대해서 ' + pelvicTiltComment + '이고, 골반에 대해서 ' + pelvicImbalanceComment + '이며, '
				+ '다리의 형태는 ' + genuVarumComment + '입니다.';
	
	workoutComment = ((pelvicTiltComment == "정상") ? "" : (pelvicTiltComment + ', '))
					+ ((pelvicImbalanceComment == "정상")? "":(pelvicImbalanceComment)) 
					+ ((genuVarumComment == "정상") ? " 교정 운동을 추천드리겠습니다.":(', ' + genuVarumComment + ' 교정 운동을 추천드리겠습니다.'))

	if(pelvicTiltComment=="정상" && pelvicImbalanceComment == "정상" && genuVarumComment =="정상"){
		workoutComment = "체형에 대해서 크게 문제되는 점이 없어 기본 운동들로 추천해드리겠습니다."
	}

	console.log(pelvicTiltComment == "정상", pelvicImbalanceComment == "정상",genuVarumComment == "정상")
	console.log(workoutComment)
	return {bodyComment, workoutComment}

}