var express = require('express');
var router = express.Router();
var fs = require('fs');
var db = require("../../database/models");
var jwt = require('jsonwebtoken');
var User = db.user;


/**
 * 회원가입 API
 */
exports.signup = async (req,res) => {
	const { kakaoId, nickname, babyDue, weightBeforePregnancy, weightNow, heightNow } = req.body;

	const user  = await User.findOne({attributes:{exclude:['id','createdAt','updatedAt']}, where:{kakaoId:kakaoId}});
	
	if( user == null){
		//User.destroy({ truncate: true, restartIdentity: true });
		var newUser = await User.create({nickname:nickname,babyDue:babyDue, weightBeforePregnancy:weightBeforePregnancy, weightNow:weightNow, heightNow:heightNow, kakaoId:kakaoId});
		console.log('[LOG]NEW USER' + 'id : ' + newUser.id + ', nickname : ' + newUser.nickname);
	}
	else{
		res.status(400).json({
			"success": false,
			"message": "해당 kakaoId를 가진 유저가 존재합니다."
		});
	}

	const sendResult = {
		"message":"Success",
		"user":{
			"nickname":newUser.nickname,   
			"babyDue":newUser.babyDue,
			"weightBeforePregnancy":newUser.weightBeforePregnancy,
			"weightNow":newUser.weightNow,
			"heightNow":newUser.heightNow,
			"kakaoId":newUser.kakaoId		
		}
	}
	res.status(201).send(sendResult);
}

/**
 * 닉네임 중복 확인 API 
 */
exports.nicknameDuplicateCheck = async (req,res) => {
	const { nickname } = req.query;
	const user  = await User.findOne({where:{nickname:nickname}});
	if (user == null){
		res.status(200).json({success:true, message:"중복된 닉네임이 없습니다."});
	}
	else{ 
		res.status(400).json({success:false, message: '해당 닉네임를 가진 유저가 존재합니다.'}); 
	}
}

/**
 * 로그인 API
 * 카카오 인증만 사용할 경우, 사용하지 않을 수도 있음.
 * 자체 로그인이 필요할 때 사용
 */
exports.login = async (req,res) => {
	const { kakaoId } = req.body;
	const secret = req.app.get('jwt-secret');
	console.log(secret);

	const user  = await User.findOne({where:{kakaoId:kakaoId}});

	if( user == null){
		res.status(400).json({success:false, message: '해당 kakaoId를 가진 사용자가 없습니다.'});
	}

	const token = await jwt.sign({
		id: user.id
	},
	secret,
	{
		expiresIn: '1d',
		subject: 'userInfo'
	});
	const result = {
		success:true,
		token:token,
		user:user
	};
	res.send(result);
}


exports.bodyTypeGlb = async (req, res) => {
	// request 는 video
	// console.log(req.query.id);
    // console.log(req.file);
    // console.log(req.file.path);
    
    var filePath = path.join(__dirname, '../..', 'uploads' ,req.file.filename);
    console.log(filePath);
    fs.access(filePath, fs.constants.F_OK, (err)=>{
         if(err) return console.log('삭제 불가능 파일');

         fs.unlink(filePath, (err)=> err?
         console.log(err) : console.log(`${filePath}를 정상적으로 삭제하였습니다.`));    
    });

    res.send("test");
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



/**
 * Kakao 에서 주는 것
 * (id=1896724603, properties={nickname=박해민}, 
 * kakaoAccount=Account(profileNeedsAgreement=null, 
 * profileNicknameNeedsAgreement=false, 
 * profileImageNeedsAgreement=null, 
 * profile=Profile(nickname=박해민,
 * 				 profileImageUrl=null,
 * 				thumbnailImageUrl=null,
 * 				isDefaultImage=null),
 * emailNeedsAgreement=null,
 * isEmailValid=null,
 * isEmailVerified=null,
 * email=null,
 * ageRangeNeedsAgreement=null,
 * ageRange=null,
 * birthyearNeedsAgreement=null,
 * birthyear=null,
 * birthdayNeedsAgreement=null,
 * birthday=null,
 * birthdayType=null,
 * genderNeedsAgreement=null,
 * gender=null,
 * ciNeedsAgreement=null,
 * ci=null,
 * ciAuthenticatedAt=null,
 * legalNameNeedsAgreement=null,
 * legalName=null,
 * legalBirthDateNeedsAgreement=null,
 * legalBirthDate=null,
 * legalGenderNeedsAgreement=null,
 * legalGender=null,
 * phoneNumberNeedsAgreement=null,
 * phoneNumber=null,
 * isKoreanNeedsAgreement=null,
 * isKorean=null),
 * groupUserToken=null,
 * connectedAt=Wed Sep 08 14:13:20 GMT+09:00 2021,
 * synchedAt=null, 
 * hasSignedUp=null)
 *
 * 
 * Access-Token
 * oYrz6zcyIVrNg_q3YefCDiN7FJvPOCh6CAkuSworDNMAAAF7yNc8mA
 * 
 */
