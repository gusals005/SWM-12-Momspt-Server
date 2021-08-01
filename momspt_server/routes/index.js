var express = require('express');
var router = express.Router();
var db = require("../database/models");
var user = db.user;

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(db); 
	user.findAll()
		.then((data)=> {
				res.send(data);
				})
		.catch((err)=>{
				res.send(err.message);
				});
		
	//res.render('index', { title: 'Express' });
});

module.exports = router;
