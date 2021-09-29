const axios = require('axios');
const db = require("../database/models");
const User = db.user;

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
	result = 1896724603;
	
	return result
} 

/**
 * 유저의 임신 후 날짜에 대해서 얻는 API
 * kakaoId와 현재 날짜로 넣기.
 */
 async function getUserDday(kakaoId,date){
	const user  = await User.findOne({where:{kakaoId:kakaoId}})
	
	if( user == null){
		return {id:-1, targetday:0};
	}
	//FOR DEBUG - 유저의 출산일 출력
	//console.log("LOG : " + nickname + " 의 출산일 : " + nicknameuser.dataValues.babyDue);
	
	var targetDay = (date - user.dataValues.babyDue)/(1000*3600*24);
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

module.exports = {
    kakaoAuthCheck,
    getUserDday,
    todayKTC
}