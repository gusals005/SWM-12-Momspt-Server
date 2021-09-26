var express = require('express');
var router = express.Router();
var fs = require('fs');
var db = require("../database/models");
var User = db.user;

/* GET home page. */
router.get('/test', async function(req, res, next) {
	res.send({"good":"hi"});		
});

module.exports = router;
