var express = require('express');
var router = express.Router();
var db = require("../database/models");
var Workout = db.workout;
var Workout_set = db.workout_set;
var H_pt_plan = db.history_pt_plan;
var User = db.user;
var H_workout = db.history_workout;

/* GET home page. */
router.get('/getinfo', async function(req, res, next) {
	var exercise = await Workout.findOne({ attributes: ['name', 'explanation','type','calorie','playtime','effect', 'thumbnail'], where : {name:req.query.name}});
	
	//console.log(exercise);
	if( exercise == null){
		res.status(500).json({err_massage:req.query.name + " does not exist."});
	}

	res.status(200).send(exercise);
	//res.render('index', { title: 'Express' });
});

router.post('/todayworkoutlist', async function(req,res,next){
	console.log(req.body);

	//오늘이 출산일 이후 며칠인지 계산.
	const user  = await User.findOne({where:{name:req.body.name}})
	//console.log(user);
	if( user == null){
		res.status(500).json({err_massage:req.body.name + " does not exist."});
	}
	console.log(user.dataValues.baby_birthday);
	var target_day = (new Date(req.body.date) - user.dataValues.baby_birthday)/(1000*3600*24);
	target_day = Math.floor(target_day);
	const target_plan_data = await H_pt_plan.findOne({where:{user_id:user.dataValues.id, date:target_day}, order:[['createdAt','desc']], limit:1});
	
	
	var target_workout_set_id = target_plan_data.new_workout_set_id;
	console.log(target_workout_set_id);

	var workoutlist = await Workout_set.findAll({
include : [{model: Workout, attributes : ['name','explanation','type','calorie','playtime','effect','thumbnail']}],
				attributes:{exclude:['id','createdAt','updatedAt']},
				where:{set_id:target_workout_set_id}
			})
		.catch((err)=>{
				console.log(err);
				res.status(500).send({err_massage: "invalid input"});
				});
	
	var todayhistory = await H_workout.findAll({attributes:['isfinish','pause_time'], where:{user_id:user.dataValues.id, date:target_day, workout_set_id:target_workout_set_id}})

	
	var output = []
	var idx = 0
	workoutlist.forEach((element) => {
		element.dataValues['history']=todayhistory[idx]
		output.push(element)
		idx = idx+1
	})
	res.status(200).send(output);
});

router.post('/sendresult', async function(req,res,next){

	/*
	var	compare_date = new Date(req.body.date);
	var mapping = await PEmapping.findAll(
			{
				include : [
				{ model: Exercise,as:'exercise', attributes : ['name','explanation','type','calorie','playtime','effect','thumbnail']}
				],
				attributes:{exclude:['id','createdAt','updatedAt']},
				where:{ '$exercise.name$':req.body.exercisename, exercise_date:req.body.date}});

	if(mapping.length == 0){
		res.status(500).json({err_massage:'invalid input'});
	}
	*/
	res.status(200).send({"message":"send result success"});
});

module.exports = router;
