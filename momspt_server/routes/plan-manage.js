var express = require('express');
var router = express.Router();
var db = require("../database/models");
var User = db.user;
var Body_type = db.body_type;
var H_body_type = db.history_body_type;
var Workout = db.workout;
var H_pt_plan = db.history_pt_plan;
var PT_plan_data = db.pt_plan_data;
/* User의 체형을 보고 운동리스트를 줌. */
router.post('/setptplan', async function(req, res, next) {
	//request.body -> name
	console.log('Set plan target : ', req.body.name);

	//오늘이 출산일 이후 며칠인지 계산.
	const user  = await User.findOne({where:{name:req.body.name}})
	//console.log(user);
	if( user == null){
		res.status(500).json({err_massage:req.query.name + " does not exist."});
	}
	var d_day = (new Date() - user.baby_birthday)/(1000*3600*24);
	d_day = Math.floor(d_day);

	
	console.log('user id : ', user.id);
	//오늘로부터 우선 7일간만 데이터 생산
	const history_body_type = await H_body_type.findAll({where:{user_id:user.id}, order: [['createdAt', 'desc']], limit : 1})
									.catch((err)=>{
											console.log(err);
											});
	
	console.log('history_body_type : ', history_body_type);
	if( history_body_type  == null){
		res.status(500).json({err_massage:req.body.name + " does not have body_type."});
	}
	

	var latest_body_type_id = history_body_type[0].dataValues.new_body_type_id;
	console.log(latest_body_type_id);
	var d_day = (new Date() - user.baby_birthday)/(1000*3600*24);
	d_day = Math.floor(d_day);
	
	var idx = 1;
	for(idx = 0; idx<7 ; idx++){
		var input_day = d_day + idx;

		const target_plan_data = await H_pt_plan.findOne({where:{user_id:user.id, date:input_day}, order:[['createdAt','desc']], limit:1});
		
		var new_pt_plan = await PT_plan_data.findOne({where:{body_type_id:latest_body_type_id, workout_date:input_day}});
		var new_workout_set_id = new_pt_plan.workout_set_id;
		
		console.log( 'target_plan_data ' ,String(idx), ' : ',target_plan_data);	
		if( target_plan_data == null){
			var past_workout_set_id = 1;	
			
			var input_plan = await H_pt_plan.create({user_id:user.id, past_workout_set_id:past_workout_set_id,new_workout_set_id:new_workout_set_id,date:input_day});
			console.log('target_data is null and add : ', input_plan);
		}
		else{
			var past_workout_set_id = target_plan_data.new_workout_set_id;

			var input_plan = await H_pt_plan.create({user_id:user.id, past_workout_set_id:past_workout_set_id,new_workout_set_id:new_workout_set_id,date:input_day});
			console.log('target_data is already exist and add : ', input_plan);
		}
	}
	
	res.status(200).send({message:'success!'});

});



module.exports = router;
