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
	
	const userComment = getComment(d_day);
	const dayComment = {
		success:true,
		dayAfterBabyDue:d_day,
		comment:userComment
	}
	res.status(200).json(dayComment);
}

function getComment(d_day){
	
	const comments = {
		step1:'임신 기간 중 약화된 근력과 체형 변형으로 뻣뻣해진 관절의 유연성을 회복시켜주는 가벼운 스트레칭부터 시작',
		step2:'조금씩 근력 회복 운동 실시하는 시기',
		step3:'임신과 출산으로 약해진 근력을 키우는 데 좀 더 집중하는 시기',
		step4:'100일 때까지 임신 전 체중으로 돌아갈 수 있도록 유산소 운동을 병행한다',
		step5:'임신 전보다 더 아름다운 몸매를 만들어줄 근육 강화운동을 하는 시기'
	};

	var user_comment = null;
	console.log(d_day)
	if(d_day >=101)
		user_comment = comments.step5;
	else if(d_day>=51)	
		user_comment = comments.step4;
	else if(d_day>=31)
		user_comment = comments.step3;
	else if(d_day>=8)
		user_comment = comments.step2;
	else
		user_comment = comments.step1;
	
	return user_comment;
}
