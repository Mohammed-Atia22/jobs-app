const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError,UnauthenticatedError} = require('../errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req,res)=>{
    const {name,email,password} = req.body;
    if(!name||!email||!password){
        throw new BadRequestError('please provide name,email and password');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password,salt);
    const tempuser = {name,email,password:hashedpassword};
    const user = await User.create({...tempuser});
    const token = user.createjwt();
    res.status(StatusCodes.CREATED).json({user:{name:user.getName()},token});
}
const login = async (req,res)=>{
    const {email,password} = req.body;
    if(!email||!password){
        throw new BadRequestError('please provide email and password');
    }
    const user = await User.findOne({email});
    if(!user){
        throw new UnauthenticatedError('invalid credentials');
    }
    const ispasswordcorrect = await user.comparepassword(password);
    if(!ispasswordcorrect){
        throw new UnauthenticatedError('invalid credentials');
    }
    const token = user.createjwt();
    res.status(StatusCodes.OK).json({user:{name:user.name},token});
}


module.exports = {
    register,
    login
}