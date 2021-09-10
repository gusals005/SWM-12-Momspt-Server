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

exports.monthlyStatistics = async (req, res) => {
    console.log(`[LOG] monthlyStatistics- req.query.month : ${req.query.month}, req.query.nickname : ${req.query.nickname}`);

    var firstDay = UTCToKST(new Date(parseInt(req.query.year), parseInt(req.query.month)-1, 1));
    var lastDay = UTCToKST(new Date(parseInt(req.query.year), parseInt(req.query.month), 0));

    const user = await User.findOne({where:{nickname:req.query.nickname}});
    let targetDay = millisecondtoDay(firstDay - user.babyDue);
    targetDay = Math.floor(targetDay);
    console.log(targetDay);

    let sendResult = [];
    let idx = 1;
    let totalDoneWorkoutTime = 0;
    let totalFinishedDay =0;
    let checkStep = [];
    for( var i = targetDay; i<=targetDay + millisecondtoDay(lastDay-firstDay)+1 ; i++){
        let dayResult = {};
        let completeCheck = 0;
        let totalCheck =0;
        dayResult.day = idx++;

        if(i >0){
            if(!checkStep.includes(convertDayToStep(i)))
            {
                checkStep.push(convertDayToStep(i));
            }
            
            const dayWorkoutHistory = await HistoryWorkout.findAll({ where:{user_id:1, date:i} })
                    .catch((err)=>{	console.log(err); });

            for ( let element of dayWorkoutHistory){
                if(element.isfinish){
                    completeCheck++;
                    const targetWorkout = await Workout.findOne({where:{id:element.workout_id}});

                    totalDoneWorkoutTime += targetWorkout.playtime;
                }
                totalCheck++;
            }

            if(totalCheck ==completeCheck && totalCheck != 0){ dayResult.status = "COMPLETE"; totalFinishedDay++; }
            else if(completeCheck != 0){ dayResult.status = "SOME"; }
            else{ dayResult.status = "NONE"; }
        }
        else{
            dayResult.status ="NONE";
        }
        sendResult.push(dayResult);
    }

    let responseStep = "";
    for( let i in checkStep){
        if( parseInt(i) + 1 == checkStep.length){
            responseStep += String(checkStep[i]);
        }
        else{
            responseStep += String(checkStep[i] + ", ");
        }
    }
    console.log(responseStep)
    let response = {
        count:totalFinishedDay,
        time:totalDoneWorkoutTime,
        step:responseStep,
        monthlyStatistics:sendResult
    }
    res.status(200).send(response);
} 

exports.detailStatistics = async (req,res) => {
    console.log(req.body);

    let user = await getUserDday(req.body.nickname, req.body.date);
    console.log(user);
    let totalTime = 0;
    let totalKcal = 0;

    const dayWorkoutHistory = await HistoryWorkout.findAll({ where:{user_id:user.id, date:user.targetDay} })
                    .catch((err)=>{	console.log(err); });
		
    console.log('[LOG] dayWorkoutHistory');
    
    for ( let element of dayWorkoutHistory){
        if(element.isfinish){
            const targetWorkout = await Workout.findOne({where:{id:element.workout_id}});
            //FOR DEBUG
            console.log(targetWorkout);
            console.log(`[LOG] todayAnalysis - target Workout : ${targetWorkout.playtime}`);
            totalTime += targetWorkout.playtime;
            totalKcal += targetWorkout.calorie;
        }
    }

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
    console.log(todayHistory);
    for ( let element of workoutList){
		element.dataValues.history=todayHistory[idx]
		output.push(element)
		idx = idx+1
	}

    let response = {
        time:totalTime,
        kcal:totalKcal,
        workout:output
    }

    res.status(200).send(response);

}

function UTCToKST(date){
    var koreaDate = date.getTime() -1*date.getTimezoneOffset()*60*1000;
    date.setTime(koreaDate);
    return date;
}

function millisecondtoDay(milli){
    return milli/(1000*3600*24);
}

function convertDayToStep(day){
    let returnValue =0;
    if(day >=101)
		returnValue =5;
	else if(day>=51)	
        returnValue =4;
	else if(day>=31)
        returnValue =3;
	else if(day>=8)
        returnValue =2;
	else
        returnValue =1;
    
    return returnValue;
}