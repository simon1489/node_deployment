const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 128
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        phoneNumber: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            required: true
        },
        about: {
            type: String,
            trim: true
        },
        role: {
            type: String,
            enum: ['admin', 'customer'],
            default: 'customer'
        },
        street: {
            type: String,
            trim: true,
            maxlength: 512
        },
        suite: {
            type: String,
            trim: true,
            maxlength: 256
        },
        city: {
            type: String,
            trim: true,
            maxlength: 128
        },
        postalCode: {
            type: String,
            trim: true,
            maxlength: 128
        },
        country: {
            type: String,
            maxlength: 128
        },
        state: {
            type: String,
            maxlength: 128
        }
    },
    { timestamps: true }
);

userSchema.pre('save', function(next) {
    var user = this;
    if (this.isModified('password' || this.IsNew)) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                return next(err)
            }
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    return next(err)
                }
                user.password = hash;
                next();
            })
        })
    } else {
        return next();
    }
});

userSchema.pre('update', function(next) {
    if (this.getUpdate().$set.password) {
        this.update({}, {
            password: bcrypt.hashSync(this.getUpdate().$set.password, 10)
        });
    }
    next();
});

userSchema.methods = {
    comparePassword: function(password, next) {
        bcrypt.compare(password, this.password, function(err, match) {
            if (err) {
                return next(err);
            }
            next(null, match);
        });
    }
}

module.exports = mongoose.model('User', userSchema);