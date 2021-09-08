var fs = require('fs');
const { search } = require('.');
var db = require("../../database/models");
var Workout = db.workout;
var WorkoutSet = db.workout_set;
var HistoryPtPlan = db.history_pt_plan;
var User = db.user;
var HistoryWorkout = db.history_workout;

/* GET home page. */

// 오늘의 운동 리스트 API
exports.getTodayWorkoutList = async (req, res) => {
	//FOR DEBUG
	console.log("[LOG] " + "getTodayWorkoutList req.body : ",req.body);

	//오늘이 출산일 이후 며칠인지 계산.
	const user = await getUserDday(req.body.nickname, req.body.date);
	const targetPlanData = await HistoryPtPlan.findOne({where:{user_id:user.id, date:user.targetDay}, order:[['createdAt','desc']], limit:1});
	var targetWorkoutSetId = targetPlanData.new_workout_set_id;
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
	var workout = await Workout.findOne({ attributes: ['name', 'workoutCode' ,'explanation','type','calorie','playtime','effect', 'thumbnail', 'video'], where : {workoutCode:req.query.workoutcode}});
	
	//console.log(exercise);
	if( workout == null){
		res.status(400).json({err_massage:req.query.name + " does not exist."});
	}

	res.status(200).send(workout);
	//res.render('index', { title: 'Express' });
}

exports.sendResult = async (req,res) => {
	
	//FOR DEBUG
	console.log("[LOG] sendResult req.Body ", req.body);

	const userInfo = await getUserDday(req.body.nickname, req.body.date);
	
	const searchTargetRows = await HistoryWorkout.findAll({where: {user_id:userInfo.id, date:userInfo.targetDay, workout_id:req.body.workout_id}});
	//FOR DEBUG
	//console.log(searchTargetRows.length);

	if(searchTargetRows.length != 1){
		res.status(400).send({"message":"invalid input."});
	}
	const updateScore = await HistoryWorkout.update({score:req.body.score, isfinish:true}, {where: {user_id:userInfo.id, date:userInfo.targetDay, workout_id:req.body.workout_id}});
	//FOR DEBUG
	console.log("[LOG] updateScore: ",updateScore);

	
	res.status(200).send({"message":"Success"});
}

exports.getJson = (req,res) => {
	const resource = req.query.name;
	const jsonFile = fs.readFileSync('./video/'+resource,'utf8');
	json = JSON.parse(jsonFile);
	//FOR DEBUG
	//console.log('LOG json rows : ' + json.exercise.length);

	res.status(200).send(json);
}

exports.weeklyWorkoutStatistics = async (req,res) => {
	//FOR DEBUG
	console.log("[LOG] " + "weeklyWorkoutStatistics req.body : ",req.body);

	//오늘이 출산일 이후 며칠인지 계산.
	//const user = await getUserDday(req.body.nickname, req.body.date);
	var today = new Date(req.body.date);
	var dayOfweek = today.getDay();
	console.log(dayOfweek);

	const sunday = new Date(today.setDate(today.getDate() - dayOfweek));
	const saturday = new Date(today.setDate(today.getDate() + 6));

	const sunUserDday = await getUserDday(req.body.nickname, sunday);
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


async function getUserDday(nickname, date){
	const user  = await User.findOne({where:{nickname:nickname}})
	//console.log(user);
	if( user == null){
		res.status(400).json({"message":nickname + " does not exist."});
	}
	//FOR DEBUG - 유저의 출산일 출력
	//console.log("LOG : " + nickname + " 의 출산일 : " + nicknameuser.dataValues.babyDue);
	var targetDay = (new Date(date) - user.dataValues.babyDue)/(1000*3600*24);
	targetDay = Math.floor(targetDay);
	
	const userId = user.dataValues.id;
	return { id:userId, targetDay:targetDay};
}

