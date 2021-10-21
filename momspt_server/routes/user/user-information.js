var db = require("../../database/models");
var User = db.user;
const {kakaoAuthCheck, getUserDday, todayKTC} = require('../utils');
const {KAKAO_AUTH_FAIL, DATA_NOT_MATCH} = require('../jsonformat');

exports.getDayComment = async (req, res) => {
    //console.log(req.query);
	const kakaoId = await kakaoAuthCheck(req);
	
	if(kakaoId < 0){
		res.status(401).json(KAKAO_AUTH_FAIL);
	}

	const userInfo = await getUserDday(kakaoId, todayKTC());
	const user  = await User.findOne({where:{id:userInfo.id}});
	if( user == null){
		res.status(400).json(DATA_NOT_MATCH);
	}

	let d_day = (todayKTC() - user.babyDue)/(1000*3600*24);
	d_day = Math.floor(d_day);
	
	const {userComment, step, day} = getComment(d_day);
	const dayComment = {
		success:true,
		dayAfterBabyDue:d_day,
		step:step,
		day:day,
		comment:userComment
	}
	res.status(200).json(dayComment);
}

function getComment(d_day){
	
	const comments = {
		step1:'관절의 유연성을 회복시켜주는\n가벼운 스트레칭을 해주세요',
		step2:'조금씩 근력 회복 운동을\n실시해주세요',
		step3:'약해진 근력을 키우는데\n좀 더 집중해주세요',
		step4:'임신 전 체중으로 돌아갈 수 있도록\n유산소 운동을 해주세요',
		step5:'더 아름다운 몸매를 만들어줄\n근육 강화운동을 해주세요'
	};

	let userComment = null;
	let step = -1;
	let day = -1;
	console.log(d_day)
	if(d_day >=101){
		userComment = comments.step5;
		step = 5;
		day = d_day - 100
	} else if(d_day>=51){
		userComment = comments.step4;
		step = 4;
		day = d_day - 50
	} else if(d_day>=31){
		userComment = comments.step3;
		step = 3;
		day = d_day - 30
	} else if(d_day>=8){
		userComment = comments.step2;
		step = 2;
		day = d_day - 7
	} else{
		userComment = comments.step1;
		step = 1;
		day = d_day
	}

	return {userComment, step, day};
}

exports.getComment = getComment