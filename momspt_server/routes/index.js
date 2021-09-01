var express = require('express');
var router = express.Router();
var fs = require('fs');
var db = require("../database/models");
var User = db.user;

/* GET home page. */
router.get('/', async function(req, res, next) {
	//console.log(db); 
	const users = await User.findAll({})
		.catch((err)=>{
				res.send(err.message);
				});
	console.log(users);
	res.send({"good":"hi"});		
//	res.render('index', { title: 'Express' });
});

/* input video json to mongodb */
router.get('/getjson', async function(req,res,next){
	var resource = req.query.name;
	let json = require('../video/' + resource);
	console.log(Object.keys(json).length);


	const jsonFile = fs.readFileSync('./video/'+resource,'utf8');
	json = JSON.parse(jsonFile);
	//check and debug
	console.log('json rows : ' + json.exercise.length);


	res.status(200).send(json);
});


module.exports = router;
