var express = require('express');
var router = express.Router();
var fs = require('fs');
var db = require("../database/models");
var User = db.user;
var {kakaoAuthCheck} = require('./user/controller');

/* GET home page. */
router.get('/', async function(req, res, next) {

	const kakaoAuthResult = await kakaoAuthCheck(req);
	console.log('Result' + kakaoAuthResult);
	//console.log(db); 
	const users = await User.findAll({})
		.catch((err)=>{
				res.send(err.message);
				});
	//console.log(users);
	res.send({"good":"hi"});		
//	res.render('index', { title: 'Express' });
});




module.exports = router;
