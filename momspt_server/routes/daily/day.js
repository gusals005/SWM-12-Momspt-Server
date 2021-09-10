var db = require("../../database/models");
var Workout = db.workout;
var WorkoutSet = db.workout_set;
var HistoryPtPlan = db.history_pt_plan;
var User = db.user;
var HistoryWorkout = db.history_workout;
var HistoryBodyType = db.history_body_type;
var BodyType = db.body_type;
var HistoryWeight = db.history_weight;

let userController = require('../user/controller');
let getUserDday = userController.getUserDday;

exports.test = async (req,res) =>{
    res.send("hi");
}
exports.todayAnalysis = async (req, res) => {

    let totalTime  = 0;
    let totalKcal = 0;
    let weightNow = 0;
    let bodyType = "";

    //FOR DEBUG
    console.log(`[LOG] todayAnalysis body : ${req.body}`);
    const user = await getUserDday(req.body.nickname, req.body.date);
    const todayWorkoutList = await HistoryWorkout.findAll({where:{user_id:user.id,date:user.targetDay}});

    todayWorkoutList.forEach( async (element)=>{
        if ( element.isfinish){
            var targetWorkoutId = element.workout_id;

            const targetWorkout = await Workout.findOne({where:{id:targetWorkoutId}});
            //FOR DEBUG
            //console.log(`[LOG] todayAnalysis - target Workout : ${targetWorkout}`);
            totalTime += targetWorkout.playtime;
            totalKcal += targetWorkout.calorie;
        }
    });

    const userInfo = await User.findOne({where:{nickname:req.body.nickname}});
    weightNow = userInfo.weightNow;

    const currentBodyType = await HistoryBodyType.findAll({where:{user_id:user.id}, order: [['createdAt', 'desc']], limit : 1})
									.catch((err)=>{
											console.log(err);
											});
    const bodyTypeInfo = await BodyType.findOne({where:{id:currentBodyType[0].new_body_type_id}});
    bodyType = bodyTypeInfo.explanation;

    let sendResult = { totalTime, totalKcal, weightNow, bodyType };
    
    res.status(200).send(sendResult);
}

exports.weeklyWeightStatistics = async (req, res) => {
    //FOR DEBUG
	console.log(`[LOG] weeklyWeightStatistics req.body : ${req.body.nickname}`);

	//오늘이 출산일 이후 며칠인지 계산.
	//const user = await getUserDday(req.body.nickname, req.body.date);
	var today = new Date(req.body.date);
	var dayOfweek = today.getDay();
	console.log(dayOfweek);

	const sunday = new Date(today.setDate(today.getDate() - dayOfweek));
	const saturday = new Date(today.setDate(today.getDate() + 6));

	const sunUserDday = await getUserDday(req.body.nickname, sunday);
	const satUserDday = sunUserDday.targetDay + 6;

    var sendResult = [];
	var idx=1;
	for(var i = sunUserDday.targetDay; i<=satUserDday; i++){
		var dayResult = {};
		
		dayResult.order = idx++;
        dayResult.workoutTime = 0;
		const dayWeightHistory = await HistoryWeight.findOne({ where:{user_id:sunUserDday.id, date:i} })
										.catch((err)=>{	console.log(err); });

        const dayWorkoutHistory = await HistoryWorkout.findAll({ where:{user_id:sunUserDday.id, date:i} })
                    .catch((err)=>{	console.log(err); });
		
        //console.log(dayWorkoutHistory);
		dayWorkoutHistory.forEach(async (element) => {
			if(element.isfinish){
                console.log("!!!!!", element.workout_id);
                const targetWorkout = await Workout.findOne({where:{id:element.workout_id}});
                //FOR DEBUG
                console.log(targetWorkout);
                console.log(`[LOG] todayAnalysis - target Workout : ${targetWorkout.playtime}`);
                dayResult.workoutTime += targetWorkout.playtime;
                console.log("@@@@@", element.workout_id);
            }
		});

        dayResult.weight = dayWeightHistory.weight;
        console.log(dayResult);
        sendResult.push(dayResult);
	}

    res.send(sendResult);
}