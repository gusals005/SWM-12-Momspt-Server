var express = require('express');
var router = express.Router();
var db = require("../database/models");
var Exercise = db.exercise;

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

module.exports = router;
