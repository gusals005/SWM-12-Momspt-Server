const fs = require('fs');
const db = require("../../database/models");
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');
const {DEFAULT_BODY_TYPE} = require('../utils');
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
	const { kakaoId, nickname, babyDue, weightBeforePregnancy, weightNow, heightNow } = req.body;

	let user  = await User.findOne({attributes:{exclude:['id','createdAt','updatedAt']}, where:{kakaoId:kakaoId}});
	
	if( user == null){
		//User.destroy({ t	runcate: true, restartIdentity: true });
		let maxId = await User.findOne({ attributes: [[Sequelize.fn('MAX', Sequelize.col('id')), 'id']] });

		let newUser = await User.create({id:maxId.id+1, nickname:nickname,babyDue:babyDue, weightBeforePregnancy:weightBeforePregnancy, weightNow:weightNow, heightNow:heightNow, kakaoId:kakaoId, babyName:""});
		console.log('[LOG]NEW USER' + 'id : ' + newUser.id + ', nickname : ' + newUser.nickname);

		maxId = await HistoryBodyType.findOne({attributes: [[Sequelize.fn('MAX', Sequelize.col('id')), 'id']] });

		let newBodyHistory = await HistoryBodyType.create({id:maxId.id+1, user_id:newUser.id, body_type_id:DEFAULT_BODY_TYPE});
		console.log('[LOG]NEW Body History' + newBodyHistory.body_type_id);

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
	}).then(res=>{
		
		let {bodyComment, workoutComment} = shapeToStr(res.data.genuVarum, res.data.pelvicImbalance, res.data.pelvicTilt);
		result.bodyComment = bodyComment;
		result.workoutComment = workoutComment;
		console.log(res.data)
		return axios.get('http://125.129.117.140:4500' + res.data.glbURL)
	})
	.then(res => {
		const s3 = new AWS.S3({
			accessKeyId:process.env.AWS_ACCESS_KEY,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			region:'ap-northeast-2'
		});

		let param = {
			'Bucket':'momsptbucket',
			'Key':'glb/' + (req.file.filename).split('.')[0] + '.glb',
			'ACL':'public-read',
			'Body':res.data,
			'ContentType':'model/gltf-binary'
		}
		
		s3.upload(param, function(err, data){
			if(err) {
				console.log(err);
			}
			console.log(data);
		});
		console.log('s3 업로드 완료')

		const prefix = 'https://momsptbucket.s3.ap-northeast-2.amazonaws.com/glb/';

		result.glbURL = prefix + (req.file.filename).split('.')[0] +  '.glb'
	})
	.catch(err=>console.log(err))


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