const jwt = require('jsonwebtoken');
const ModalUser = require('../models/user');

const authenticate = async (req, res, next) => {
    const authorization = req.headers['authorization'];
    if(authorization){        
        const token = authorization.replace('Bearer ','').replace('bearer ','');
        try {
            const decoded = jwt.verify(token, config.jwtSecret);
            if(decoded){
                var result = await ModalUser.findById(decoded.sub);
                if(result.length === 1) {
                    req.user = result;
                    return next();
                } 
                return res.status(401).send({error: 'Unauthorized', message : 'Authentication failed (token).'});
            }
        } catch (e) {
            console.log(e);
        }
    }
    return res.status(401).send({error: 'Unauthorized', message : 'Authentication failed (token).'});
}

module.exports = authenticate;
