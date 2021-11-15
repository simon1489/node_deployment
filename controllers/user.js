const User = require('../models/user');

exports.userById = (req,res,next,userId) => {
    User.findById(userId).exec((err,user) => {
        if(err || !user){
            return res.status(400).json({
                error: "User not found"
            })
        }

        req.profile = user;
        next();
    });
}

exports.read = (req, res) => {
    req.profile.password = undefined;
    return res.json(req.profile);
};

// exports.update = (req, res) => {
//     console.log('user update', req.body);
//     req.body.role = 0; // role will always be 0
//     User.findOneAndUpdate({ _id: req.profile._id }, { $set: req.body }, { new: true }, (err, user) => {
//         if (err) {
//             return res.status(400).json({
//                 error: 'You are not authorized to perform this action'
//             });
//         }
//         user.hashed_password = undefined;
//         user.salt = undefined;
//         res.json(user);
//     });
// };

exports.update = (req, res) => {
    // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
    const { name, phoneNumber, password, street, suite, city, postalCode, country, state } = req.body;

    User.findOne({ _id: req.profile._id }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (!name) {
            return res.status(400).json({
                error: 'Name is required'
            });
        } else {
            user.name = name;
        }

        if(phoneNumber){
            user.phoneNumber = phoneNumber;
        }

        if(street){
            user.street = street;
        }

        if(suite){
            user.suite = suite;
        }
        
        if(city){
            user.city = city;
        }
        
        if(postalCode){
            user.postalCode = postalCode;
        }

        if(country){
            user.country = country;
        }

        if(state){
            user.state = state;
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be min 6 characters long'
                });
            } else {
                user.password = password;
            }
        }

        user.save((err, updatedUser) => {
            if (err) {
                console.log('USER UPDATE ERROR', err);
                return res.status(400).json({
                    error: 'User update failed'
                });
            }
            const { _id, email, name, role, phoneNumber} = updatedUser;

            res.json({_id, email, name, role, phoneNumber});
        });
    });
};