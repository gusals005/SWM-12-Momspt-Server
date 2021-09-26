var express = require('express');
var router = express.Router();
var fs = require('fs');
var db = require("../database/models");
var User = db.user;
var {kakaoAuthCheck} = require('./user/controller');

/* GET home page. */
router.get('/test', async function(req, res, next) {

	// const kakaoAuthResult = await kakaoAuthCheck(req);
	// console.log('Result' + kakaoAuthResult);
	// //console.log(db); 
	// const users = await User.findAll({})
	// 	.catch((err)=>{
	// 			res.send(err.message);
	// 			});
	//console.log(users);

	let newDate = new Date();
	console.log(UTCToKST(newDate));


	res.send({"good":"hi"});		
//	res.render('index', { title: 'Express' });
});

function UTCToKST(date){
    var koreaDate = date.getTime() -1*date.getTimezoneOffset()*60*1000;
    date.setTime(koreaDate);
    return date;
}

module.exports = router;
