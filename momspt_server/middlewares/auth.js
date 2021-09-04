const jwt = require('jsonwebtoken')

const authMiddleware = async (req, res, next) => {
	// read the token from header or url 
	const token = req.headers['x-access-token'] || req.query.token
    // token does not exist
	if(!token) {
		return res.status(403).json({
			success: false,
			message: 'not logged in'
	    })
	}

	// create a promise that decodes the token
	const p = new Promise(
		(resolve, reject) => {
			jwt.verify(token, req.app.get('jwt-secret'),
					(err, decoded) => {
							if(err) reject(err)
							resolve(decoded)
					})
		}
	)
	
	const onError = (error) => {
        res.status(400).json({
            success: false,
            message: error.message
		})
	}

	// process the promise
    p.then((decoded)=>{
			req.decoded = decoded
			next()
	}).catch(onError)
}

module.exports = authMiddleware
