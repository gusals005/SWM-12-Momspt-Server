const db = require("../../database/models");
const Workout = db.workout;
const User = db.user;
const HistoryWorkout = db.history_workout;
const HistoryBodyType = db.history_body_type;
const BodyType = db.body_type;
const HistoryWeight = db.history_weight;
const WorkoutType = db.workout_type;
const WorkoutEffect = db.workout_effect;
const PtPlanData = db.pt_plan_data;
const {kakaoAuthCheck, getUserDday, todayKTC, findBodyType} = require('../utils');
const {getWorkoutList} = require('../workout/workout');
const {getComment} = require('../user/user-information')

exports.monthlyStatistics = async (req, res) => {
    const kakaoId = await kakaoAuthCheck(req);
    if( kakaoId < 0 ){
        res.status(401).json(KAKAO_AUTH_FAIL);
        return;
    }

    let firstDate = UTCToKST(new Date(parseInt(req.query.year), parseInt(req.query.month)-1, 1));
    let lastDate = UTCToKST(new Date(parseInt(req.query.year), parseInt(req.query.month), 0));
    let today = todayKTC();

    const userInfoFirstDay = await getUserDday(kakaoId, firstDate);
    let startDay = userInfoFirstDay.targetDay;
    let lastDay = startDay + millisecondtoDay(lastDate - firstDate);
    

    let sendResult = [];
    
    let totalDoneWorkoutTime = 0;
    let completeDayCount =0;
    let checkStep = [];
    for( let i = startDay, idx = 1; i <= lastDay ; i++, idx++){
        let dayResult = {};
        let completeWorkoutCheck = 0;
        let totalCheck =0;
        dayResult.day = idx;

        if(i>0){
            if(!checkStep.includes(convertDayToStep(i)))
            {
                checkStep.push(convertDayToStep(i));
            }
            //execute all workout count of day
            let workoutIdList = [];
            let nowDate = new Date(today.setDate(today.getDate() + idx - 1));
            const bodyTypeIdList = await findBodyType(userInfoFirstDay.id, nowDate);
        
            for(let bodyTypeId of bodyTypeIdList){
                let workoutList = await PtPlanData.findAll({where:{body_type_id:bodyTypeId, workout_date: i}});
                for(let workout of workoutList){
                    workoutIdList.push(workout.workout_id);
                }
            }
            
            totalCheck = workoutIdList.length;

            //to find complete workout
            const dayWorkoutHistory = await HistoryWorkout.findAll({ where:{user_id:userInfoFirstDay.id, date:i} })
                    .catch((err)=>{	console.log(err); });

            for ( let element of dayWorkoutHistory){
                completeWorkoutCheck++;
                const targetWorkout = await Workout.findOne({where:{id:element.workout_id}});
                totalDoneWorkoutTime += targetWorkout.playtime;
            }

            if(totalCheck ==completeWorkoutCheck && totalCheck != 0){ dayResult.status = "COMPLETE"; completeDayCount++; }
            else if(completeWorkoutCheck != 0){ dayResult.status = "SOME"; }
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
        count:completeDayCount,
        time:totalDoneWorkoutTime,
        step:responseStep,
        monthlyStatistics:sendResult
    }
    res.status(200).send(response);
} 

exports.detailStatistics = async (req,res) => {
    
    const kakaoId = await kakaoAuthCheck(req);
    if( kakaoId < 0 ){
        res.status(401).json(KAKAO_AUTH_FAIL);
        return;
    }

    let totalTime = 0;
    let totalKcal = 0;
    let workoutList = await getWorkoutList(kakaoId, new Date(req.body.date));

    const user = await getUserDday(kakaoId, new Date(req.body.date))
    
    let step, day
    if(user.targetDay >0){
        data = getComment(user.targetDay)
        step = data.step
        day = data.day
    }else{
        step = 0
        day = 0
    }
    

    for( let workout of workoutList){
        if(workout.dataValues.history != null){
            totalTime += workout.playtime;
            totalKcal += workout.calorie;
        }
    }

    let response = {
        time:totalTime,
        kcal:totalKcal,
        step:step,
        day:day,
        workout:workoutList
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