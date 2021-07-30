var express = require('express');
var router = express.Router();
var db = require("../database/models");
var Exercise = db.exercise;
var PEmapping = db.pt_plan_exercise_mapping

/* GET home page. */
router.get('/getinfo', async function(req, res, next) {
	var exercise = await Exercise.findOne({ attributes: ['name', 'explanation','type','calorie','playtime','effect', 'thumbnail'], where : {name:req.query.name}});
	
	//console.log(exercise);
	if( exercise == null){
		res.status(500).json({err_massage:req.query.name + " does not exist."});
	}

	res.status(200).send(exercise);
	//res.render('index', { title: 'Express' });
});

router.get('/todayexerciselist', async function(req,res,next){
	
	var mapping = await PEmapping.findAll(
			{
				include : [
				{ model: Exercise, attributes : ['name','explanation','type','calorie','playtime','effect','thumbnail']}
				],
				attributes:{exclude:['id','createdAt','updatedAt']},
				where:{ exercise_date: req.query.date}});
	
	if(mapping.length == 0){
		res.status(500).json({err_message : 'invalid input'});
	}
	

	res.status(200).send(mapping);
})
module.exports = router;
