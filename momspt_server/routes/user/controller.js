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
	// console.log(req.query.id);
    // console.log(req.file);
    // console.log(req.file.path);
    
    var filePath = path.join(__dirname, '../..', 'uploads' ,req.file.filename);
    console.log(filePath);
    fs.access(filePath, fs.constants.F_OK, (err)=>{
         if(err) return console.log('삭제 불가능 파일');

         fs.unlink(filePath, (err)=> err?
         console.log(err) : console.log(`${filePath}를 정상적으로 삭제하였습니다.`));    
    });

    res.send("test");
	// response는 glb file 주소
}

exports.bodyTypeAnalysis = async (req, res) => {
	//response
	const sendResult = {
		"bodyType":"Analysis1",
		"workoutComment":"Analysis2"
	};
	res.status(200).send(sendResult);
}

