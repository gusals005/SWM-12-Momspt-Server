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
	const { nickname, babyDue, weightBeforePragnancy, weightNow, heightNow } = req.body;

	const user  = await User.findOne({where:{nickname:nickname}});
	
	if( user == null){
		//User.destroy({ truncate: true, restartIdentity: true });
		var newUser = await User.create({nickname:nickname,babyDue:babyDue, weightBeforePragnancy:weightBeforePragnancy, weightNow:weightNow, heightNow:heightNow});
		console.log('[log]NEW USER' + 'id : ' + newUser.id + ', nickname : ' + newUser.nickname);
	}
	else{
		res.status(400).json({"error": nickname+ " already exists."});
	}

	const sendResult = {
		"massage":"Success",
		"user":newUser
	}
	res.status(201).send(sendResult);
}

exports.nicknameDuplicateCheck = async(req,res) => {
	const { nickname } = req.body;
	const user  = await User.findOne({where:{nickname:nickname}});
	if (user == null){
		res.status(200).json({"massage":"Success"});
	}
	else{
		res.status(400).json({"massage":nickname+' already exists.'}); 
	}
}


exports.bodyTypeGlb = async (req, res) => {
	// request 는 video

	// response는 glb file 주소
}

exports.bodyTypeAnalysis = async (req, res) => {
	//response
	const sendResult = {
		"bodyType":"Analysis1",
		"workoutComment":"Analysis2"
	};
	res.status(200).send(sendResult);
}


exports.login = async (req,res) => {
	const { nickname } = req.body;
	const secret = req.app.get('jwt-secret');
	console.log(secret);

	const user  = await User.findOne({where:{nickname:nickname}});

	if( user == null){
		res.status(500).json({err_massage:req.query.name + " does not exist."});
	}

	const token = await jwt.sign({
		nickname: req.body.nickname
	},
	secret,
	{
		expiresIn: '1d',
		subject: 'userInfo'
	});
	const result = {token, user};
	res.send(result);
}

