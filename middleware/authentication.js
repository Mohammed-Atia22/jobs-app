const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {UnauthenticatedError} = require('../errors');

const auth = async (req,res,next)=>{
    const authheader = req.headers.authorization;
    if(!authheader||!authheader.startsWith('Bearer')){
        throw new UnauthenticatedError('authentication invalid');
    }
    const token = authheader.split(' ')[1];
    try {
        const payload = jwt.verify(token,process.env.JWT_SECRET);
        // const user = User.findById((payload.id).select('-password'));
        // req.user = user;
        req.user = {userid:payload.userid,name:payload.name};
        next();
    } catch (error) {
        throw new UnauthenticatedError('authentication invalid');
    }
}


module.exports = auth;