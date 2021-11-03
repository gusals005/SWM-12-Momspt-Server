const db = require("../../database/models");
const Workout = db.workout;
const User = db.user;
const HistoryWorkout = db.history_workout;
const HistoryBodyType = db.history_body_type;
const BodyType = db.body_type;
const HistoryWeight = db.history_weight;
const WorkoutType = db.workout_type;
const WorkoutEffect = db.workout_effect;
const Sequelize = require('sequelize');
const {kakaoAuthCheck, getUserDday, todayKTC, findBodyType} = require('../utils');
const {DATA_NOT_MATCH, KAKAO_AUTH_FAIL} = require('../jsonformat');

exports.todayAnalysis = async (req, res) => {

    let totalTime  = 0;
    let totalKcal = 0;
    let weightNow = 0;
    let bodyTypeList = [];

    const kakaoId = await kakaoAuthCheck(req);
    if( kakaoId < 0 ){
        res.status(401).json(KAKAO_AUTH_FAIL);
        return;
    }

	const userInfo = await getUserDday(kakaoId,todayKTC());
    if ( !userInfo.id <0){
        res.status(400).json(DATA_NOT_MATCH);
        return;
    }

    const doneWorkoutList = await HistoryWorkout.findAll({where:{user_id:userInfo.id, date:userInfo.targetDay}});

    for( let history of doneWorkoutList){
        const targetWorkout = await Workout.findOne({where:{id:history.workout_id}});
        //FOR DEBUG
        //console.log(`[LOG] todayAnalysis - target Workout : ${targetWorkout}`);
        totalTime += targetWorkout.playtime;
        totalKcal += targetWorkout.calorie;
    }

    const userWeightInfo = await HistoryWeight.findAll({where:{user_id:userInfo.id, date:userInfo.targetDay}, order:[['createdAt', 'desc']]}); 
    
    if (userWeightInfo.length != 0){
        weightNow = userWeightInfo[0].weight;
    }
    

    const bodyTypeIdList = await findBodyType(userInfo.id, todayKTC());

    for(let bodyTypeId of bodyTypeIdList){
        const bodyTypeInfo = await BodyType.findOne({ attributes:['id', 'name', 'explanation'], where:{id:bodyTypeId}});
        bodyTypeList.push(bodyTypeInfo);
    }
    
    let sendResult = { totalTime, totalKcal, weightNow, bodyType:bodyTypeList };
    
    res.status(200).send(sendResult);
}

exports.weeklyStatistics = async (req, res) => {

    const kakaoId = await kakaoAuthCheck(req);
    if( kakaoId < 0 ){
        res.status(401).json(KAKAO_AUTH_FAIL);
        return;
    }

	//오늘이 출산일 이후 며칠인지 계산.
	//const user = await getUserDday(req.body.nickname, req.body.date);
	let today = todayKTC();
	let dayOfweek = today.getDay();

	const sunday = new Date(today.setDate(today.getDate() - dayOfweek));
	const userInfoSunday = await getUserDday(kakaoId, sunday);

    var sendResult = [];
	var idx=1;
	for(var i = 0; i< 7; i++){
		var dayResult = {};
		
		dayResult.order = idx++;
        dayResult.workoutTime = 0;

        let nowDate = new Date(today.setDate(today.getDate() + i));
		let nowTargetDay = userInfoSunday.targetDay + i;

		const dayWeightHistory = await HistoryWeight.findOne({ where:{user_id:userInfoSunday.id, date:nowTargetDay} })
										.catch((err)=>{	console.log(err);});

        const dayWorkoutHistory = await HistoryWorkout.findAll({ where:{user_id:userInfoSunday.id, date:nowTargetDay} })
                    .catch((err)=>{	console.log(err); });
		
        console.log('[LOG] dayWorkoutHistory');
        console.log(dayWorkoutHistory[0]);
        for ( let element of dayWorkoutHistory){
            const targetWorkout = await Workout.findOne({where:{id:element.workout_id}});
            //FOR DEBUG
            // console.log(targetWorkout);
            // console.log(`[LOG] todayAnalysis - target Workout : ${targetWorkout.playtime}`);
            dayResult.workoutTime += targetWorkout.playtime;
		};

        if(dayWeightHistory == null){
            dayResult.weight = null;
        }
        else{
            dayResult.weight = dayWeightHistory.weight;
        }
        
        // console.log('[LOG] dayResult');
        // console.log(dayResult);
        sendResult.push(dayResult);
	}

    res.send(sendResult);
}

exports.insertTodayWeight = async (req, res) => {

    const kakaoId = await kakaoAuthCheck(req);
    if( kakaoId < 0 ){
        res.status(401).json(KAKAO_AUTH_FAIL);
        return;
    }

    const user = await getUserDday(kakaoId,todayKTC());

    const searchWeightHistory = await HistoryWeight.findOne({where: {user_id:user.id, date:user.targetDay}})

    console.log(searchWeightHistory)
	if(searchWeightHistory == null){
		//create new record
		let maxId = await HistoryWeight.findOne({ attributes: [[Sequelize.fn('MAX', Sequelize.col('id')), 'id']] });
		const insertRecored = await HistoryWeight.create({id:maxId.id+1, user_id:user.id, date:user.targetDay, weight:req.body.weight});
	}
	else{
		//update code
		const updateRecord = await HistoryWeight.update({weight:req.body.weight}, {where: {user_id:user.id, date:user.targetDay}});
		//console.log("[LOG] updateScore: ",updateScore);
	}

    res.status(200).send({success:true, message:'정상적으로 몸무게를 저장했습니다.'});
}