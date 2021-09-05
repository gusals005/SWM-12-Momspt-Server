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




module.exports = router;
