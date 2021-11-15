exports.userSignupValidator = (req,res, next) => {
    //Name validator
    req.check('name', "Name is require").notEmpty();
    //Email Validator
    req.check('email', "Email must be between 3 to 32 characters")
        .isLength({
            min: 4,
            max: 32
        })
        .isEmail()
        .withMessage("Must be a valid email");
    //Password validator   
    req.check('password', "Password is require").notEmpty(); 
    req.check('password')
        .isLength({min: 6})
        .withMessage("Password must contain at least 6 characters");
    
    const errors = req.validationErrors();

    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        return res
                .status(400)
                .json({error: firstError});
    }

    next();        
}