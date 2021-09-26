var fs = require('fs');
var db = require("../../database/models");
const { DATA_NOT_MATCH } = require('../jsonformat');
const { kakaoAuthCheck, getUserDday, todayKTC} = require('../utils');
var Workout = db.workout;
var WorkoutSet = db.workout_set;
var HistoryPtPlan = db.history_pt_plan;
var User = db.user;
var HistoryWorkout = db.history_workout;


/* GET home page. */

// 오늘의 운동 리스트 API
exports.getTodayWorkoutList = async (req, res) => {

	const kakaoId = await kakaoAuthCheck(req);
    if( kakaoId < 0 ){
        res.status(401).json(KAKAO_AUTH_FAIL);
    }

	const user = await getUserDday(kakaoId,todayKTC());
    if ( !user.id <0){
        res.status(400).json(DATA_NOT_MATCH);
    }

	const targetPlanData = await HistoryPtPlan.findOne({where:{user_id:user.id, date:user.targetDay}, order:[['createdAt','desc']], limit:1});

	if(targetPlanData == null){
		res.status(400).json(DATA_NOT_MATCH);
	}

	let targetWorkoutSetId = targetPlanData.new_workout_set_id;
	//FOR DEBUG
	console.log("[LOG] " + "targetWorkoutSetId : ", targetWorkoutSetId);

	var workoutList = await WorkoutSet.findAll({
		include : [{model: Workout, attributes : ['name', 'workoutCode','explanation','type','calorie','playtime','effect','thumbnail', 'video']}],
						attributes:{exclude:['id','createdAt','updatedAt']},
						where:{set_id:targetWorkoutSetId}
					})
				.catch((err)=>{
						console.log(err);
						res.status(400).send({err_message: "invalid input"});
						});

	var todayHistory = await HistoryWorkout.findAll({attributes:['isfinish','pause_time', 'score'], where:{user_id:user.id, date:user.targetDay, workout_set_id:targetWorkoutSetId}})

	var output = []
	var idx = 0
	workoutList.forEach((element) => {
		element.dataValues['history']=todayHistory[idx]
		output.push(element)
		idx = idx+1
	})
	res.status(200).send(output);
}

// 운동 상세 정보 얻기 API
exports.getInfo = async (req, res) => {

	const kakaoId = await kakaoAuthCheck(req);
    if( kakaoId < 0 ){
        res.status(401).json(KAKAO_AUTH_FAIL);
    }

	var workout = await Workout.findOne({ attributes: ['name', 'workoutCode' ,'explanation','type','calorie','playtime','effect', 'thumbnail', 'video'], where : {workoutCode:req.query.workoutcode}});
	
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

	if(searchTargetRows.length != 1){
		res.status(400).send(DATA_NOT_MATCH);
	}
	const updateScore = await HistoryWorkout.update({score:req.body.score, isfinish:true}, {where: {user_id:user.id, date:user.targetDay, workout_id:req.body.workout_id}});
	//FOR DEBUG
	console.log("[LOG] updateScore: ",updateScore);

	res.status(200).send({success:true, message:'정상적으로 운동 결과를 저장했습니다.'});
}

exports.getJson = async (req,res) => {
	const kakaoId = await kakaoAuthCheck(req);
    if( kakaoId < 0 ){
        res.status(401).json(KAKAO_AUTH_FAIL);
    }

	const resource = req.query.workoutcode +'.json';
	const jsonFile = fs.readFileSync('./video/'+resource,'utf8');
	json = JSON.parse(jsonFile);
	//FOR DEBUG
	//console.log('LOG json rows : ' + json.exercise.length);

	res.status(200).send(json);
}

exports.weeklyWorkoutStatistics = async (req,res) => {

	const kakaoId = await kakaoAuthCheck(req);
    if( kakaoId < 0 ){
        res.status(401).json(KAKAO_AUTH_FAIL);
    }

	//오늘이 출산일 이후 며칠인지 계산.
	//const user = await getUserDday(req.body.nickname, req.body.date);
	var today = todayKTC();
	var dayOfweek = today.getDay();
	console.log(dayOfweek);

	const sunday = new Date(today.setDate(today.getDate() - dayOfweek));
	const saturday = new Date(today.setDate(today.getDate() + 6));

	const sunUserDday = await getUserDday(kakaoId, sunday);
	const satUserDday = sunUserDday.targetDay + 6;

	//FOR DEBUG
	//console.log(sunUserDday.targetDay, satUserDday);

	var sendResult = [];
	var idx=1;
	for(var i = sunUserDday.targetDay; i<=satUserDday; i++){
		var dayResult = {};
		
		dayResult.order = idx++;
		const dayWorkoutHistory = await HistoryWorkout.findAll({ where:{user_id:sunUserDday.id, date:i} })
										.catch((err)=>{	console.log(err); });
		
		var done = 0, total =0;
		dayWorkoutHistory.forEach((element) => {
			if(element.isfinish)
				done++;
			total++;
		});
		dayResult.done = done;
		dayResult.totalWorkout = total;
		sendResult.push(dayResult);
	}

	console.log("[LOG] weeklyResult : ", sendResult);
	
	res.status(200).send(sendResult);

}



