const User = require('../models/user');
const {errorHandler} = require('../helpers/dbErrorHandler');
const jwt = require('jsonwebtoken');
const utils = require('../utils');

//Token generetor
const  generateToken = (doc, expiresIn) => {
    return jwt.sign(doc, process.env.JWT_SECRET, {
        expiresIn: expiresIn
    });
}

//Signup function
exports.signup = (req, res) => {
    console.log('req.body',req.body);
    const user = new User(req.body);

    user.save((err,user) => {
        if(err){
            console.log(err);
            res.status(400).json({
                error : errorHandler(err)
            });
        }else{
            console.log("User created", user);

            res.status(201).json(user);
        }
    });
}

//Signin function
exports.signin = (req, res) => {
    //Validate email and password exist within the request body
    if (!req.body.email || !req.body.password) {
        return utils.errorResponse(res, 'MISSING_REQUIRED_FIELDS');
    }

    //Find the user based on email
    console.log('req.body',req.body)
    const {email,password} = req.body;
    //Find user in DB
    User.findOne({
        email: email.trim().toLowerCase()
    }, function(err, user) {
        if (err) {
            return utils.errorResponse(res, 'INTERNAL_ERROR', err);
        }
        if (!user) {
            return utils.errorResponse(res, 'USER_NOT_EXIST');
        }

        user.comparePassword(password, function(err, match) {
            if (err) {
                return utils.errorResponse(res, 'INTERNAL_ERROR', err);
            }
            
            if (!match) {
                return utils.errorResponse(res, 'BAD_CREDENTIALS');
            }
            console.log('user',user)
            const {_id, name, email, role} = user;
            return res.status(200).json({ 
                token:generateToken({
                    _doc: {
                        _id: user._id,
                        role: user.role
                    }
                },
                "365d"), 
                user: {
                    _id, 
                    email, 
                    name, 
                    role
                }   
            });
        });
    });
}

//Signout function
exports.signout = (req, res) => {
    console.log('cookie res clear:', res);
    res.clearCookie("t");
    return res.status(200).json({message: "Signout Success"});
}

//Auth validation
exports.isAuth = function(req, res, next) {
    console.log('req.body', req.body)
    let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
                return utils.errorResponse(res, 'AUTHENTICATE_FAILED', err);
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return utils.errorResponse(res, 'NO_TOKEN_PROVIDED');
    }
}

//Admin validation
exports.isAdmin = function(req, res, next) {
    if (req.decoded._doc.role != 'admin')
        return utils.errorResponse(res, 'UNAUTHORIZED');
    else
        next();
}

//Owner validation
exports.isOwner = (req, res, next) => {
    let owner  = req.profile && req.decoded._doc && req.profile._id == req.decoded._doc._id;

    if (!owner) {
        return utils.errorResponse(res, 'ACCESS_DENIED');
    }
    next();
}
