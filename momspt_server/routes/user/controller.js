var express = require('express');
var router = express.Router();
var fs = require('fs');
var db = require("../../database/models");
var jwt = require('jsonwebtoken');
var User = db.user;

exports.test = async (req, res) => {
	res.send({"hi":"hi"});
}

exports.signup = async (req,res) => {
	const { nickname } = req.body;

	const user  = await User.findOne({where:{name:nickname}});
	
	if( user == null){
		res.status(500).json({err_massage:req.query.name + " does not exist."});
	}

	res.send(user);
}

exports.login = async (req,res) => {
	const { nickname } = req.body;
	const secret = req.app.get('jwt-secret');
	console.log(secret);

	const user  = await User.findOne({where:{name:nickname}});
	if( user == null){
		res.status(500).json({err_massage:req.query.name + " does not exist."});
	}

	const token = await jwt.sign({
		user_id: req.body.nickname
	},
	secret,
	{
		expiresIn: '1d',
		subject: 'userInfo'
	});
	const result = {token, user};
	res.send(result);
}

exports.check = async (req, res) => {
	// read the token from header or url 
	res.status(200).json({
        success: true,
        message: req.decoded
	})
}

