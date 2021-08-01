require('dotenv').config()

module.exports = {
	/*
	development : {
		url: process.env.DEV_DATABASE_URL,
		dialect: "postgres"
	}
	*/
	development :{
		username : process.env.USERNAME,
		password : process.env.PASSWORD,
		database : process.env.DATABASE,
		host : process.env.HOST,
		dialect: 'postgres'
	}
}
