const config = require('../config/app');
const jwt = require('jsonwebtoken')
const { db_read } = require('../config/db');
const Hash = require('crypto-js/pbkdf2');

/**
* Returns jwt token if valid email and password is provided
* @param req
* @param res
* @returns {*}
*/
let login = async(req, res) => {
    try {
        var response = await db_read.query('SELECT user_id, email, password FROM user where email = ?', [req.body.email]);
        if(response[0].length === 1){
            const user = response[0][0];
            const passwordInput = Hash(req.body.password, config.appSecret).toString();
            if(user.password !== passwordInput){
                return res.status(401).send({error: 'Unauthorized', message : 'Authentication failed'});
            } else {

                const sign = {
                    exp: Math.floor(Date.now() / 1000) + config.jwtExpire, // expire time
                    sub: user.user_id,                                          // Identifies the subject of the JWT.
                };
                
                return res.json({
                    message: "success",
                    data: jwt.sign(sign, config.jwtSecret)
                });
            }
        } else {
            console.log(err);
            return res.status(401).send({error: 'Unauthorized', message : 'Authentication failed'});
        }
    } catch (err) {
        console.log(err);
        return res.status(401).send({error: 'Unauthorized', message : 'Authentication failed'});
    } 
}

/**
* Returns user info
* @param req
* @param res
* @returns {*}
*/
let me = (req, res) =>{    
    res.json({
        message: "success",
        data: req.user
    });
}

module.exports = { login, me };