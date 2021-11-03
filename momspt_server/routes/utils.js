const axios = require('axios');
const db = require("../database/models");
const User = db.user;
const HistoryBodyType = db.history_body_type;
const {Op} = require('sequelize');

const DEFAULT_BODY_TYPE = 1;
const ANTERIOR_BODY_TYPE = 2;
const O_LEG_BODY_TYPE = 3;
const POSTERIOR_BODY_TYPE = 4;
const X_Leg_BODY_TYPE = 5;
const PELVICIMBALANCE_BODY_TYPE = 6;

async function kakaoAuthCheck(req){
	const token = req.headers['x-access-token'];
	const kakaoAuthResult = await kakaoAuth(token);

	return kakaoAuthResult;
}

async function kakaoAuth(access_token){
	
	let result = -1;

	await axios({
		method:'post',
		url:'https://kapi.kakao.com/v2/user/me',
		headers:{'Authorization': `Bearer ${access_token}`, 'Content-type':'application/x-www-form-urlencoded;charset=utf-8'}
	})
	.then((response) => {
		result = response.data.id;
		console.log('response : ', response);
	})
	.catch((error) =>{
		result = -1;
		console.log('error : ', error);
	});
	//FOR TSET
	// result = 1896724603;
	
	return result
} 

/**
 * 유저의 임신 후 날짜에 대해서 얻는 API
 * kakaoId와 현재 날짜로 넣기.
 */
 async function getUserDday(kakaoId,date){
	const user  = await User.findOne({where:{kakaoId:kakaoId}})
	
	if( user == null){
		return {id:-1, targetDay:0};
	}
	//FOR DEBUG - 유저의 출산일 출력
	//console.log("LOG : " + nickname + " 의 출산일 : " + nicknameuser.dataValues.babyDue);
	
	var targetDay = (date - user.dataValues.babyDue)/(1000*3600*24);
	console.log('[LOG]targetDay',targetDay);
	targetDay = Math.floor(targetDay);
	
	const userId = user.dataValues.id;
	return { id:userId, targetDay:targetDay};
}

function todayKTC(){
	let todayUTC = new Date();
	let todayMidnight = new Date(todayUTC.getUTCFullYear(),todayUTC.getUTCMonth(), todayUTC.getUTCDate());

	todayMidnight.setTime(todayMidnight.getTime() -1*todayMidnight.getTimezoneOffset()*60*1000)

	return todayMidnight;
}

async function findBodyType(userId, date){

	let bodyTypeList = [];
	const bodyType = await HistoryBodyType.findAll({
													where:{
														user_id:userId,
														createdAt: {
															[Op.lte]: date
														}},
													order:[
														['createdAt','desc'],
														['body_type_id', 'desc']
													],
												})
												.catch((err) =>{
													console.log("[LOG][ERROR]findBodyType function error");
													console.log(err);
												})
	
	for(let type of bodyType){
		bodyTypeList.push(type.body_type_id);
		if(type.body_type_id == 1)
			break;
	}

	bodyTypeList.sort((a,b)=>{
		if(a>=b) return 1;
		else return -1;
	});
	return bodyTypeList;
}

module.exports = {
    kakaoAuthCheck,
    getUserDday,
    todayKTC,
	findBodyType,
	DEFAULT_BODY_TYPE, ANTERIOR_BODY_TYPE, O_LEG_BODY_TYPE,
	POSTERIOR_BODY_TYPE, X_Leg_BODY_TYPE, PELVICIMBALANCE_BODY_TYPE
}