const express = require('express');
const  router = express.Router();
const db = require('../database/models');
const User = db.user;

/* GET users listing. */
router.get('/getdaycomment', async function(req, res, next) {
	//console.log(req.query);
	const user  = await User.findOne({where:{name:req.query.name}})
	//console.log(user);
	if( user == null){
		res.status(500).json({err_massage:req.query.name + " does not exist."});
	}
	var d_day = (new Date() - user.baby_birthday)/(1000*3600*24);
	d_day = Math.floor(d_day);
	
	const user_comment = getComment(d_day);

	const day_comment = {
		d_day:d_day,
		comment:user_comment
	}
	res.status(200).json(day_comment);
});

function getComment(d_day){
	
	const comments = {
		step1:'임신 기간 중 약화된 근력과 체형 변형으로 뻣뻣해진 관절의 유연성을 회복시켜주는 가벼운 스트레칭부터 시작',
		step2:'조금씩 근력 회복 운동 실시하는 시기',
		step3:'임신과 출산으로 약해진 근력을 키우는 데 좀 더 집중하는 시기',
		step4:'100일 때까지 임신 전 체중으로 돌아갈 수 있도록 유산소 운동을 병행한다',
		step5:'임신 전보다 더 아름다운 몸매를 만들어줄 근육 강화운동을 하는 시기'
	};

	var user_comment = null;
	if(d_day >=101)
		user_comment = comments.step5;
	else if(d_day>=51)
		user_comment = comments.step4;
	else if(d_day>=31)
		user_commnet = comments.step3;
	else if(d_day>=8)
		user_comment = comments.step2;
	else
		user_comment = comments.step1;

	return user_comment;
}

module.exports = router;
