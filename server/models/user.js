const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => {
                validator.isEmail(value)
            },
            message: '{value} is not a valid email'
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        }
    }]
});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
  
    return _.pick(userObject, ['_id', 'email']);

};

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (err) {
        // console.log(err);
        // return new Promise((resolve, reject) => {
        //     reject();
        // });

        // Simple promise call below
        return Promise.reject('Cannot verify!')
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth',
    });
  
};  

UserSchema.pre('save', function(next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user._doc.password, salt, (err, hash)=> {
                // console.log('Hash = ', hash);
                user._doc.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

// Find user by username and password - Jason Custom
UserSchema.statics.findByCredentials = function(email, password) {
    var user = this;
    
    return User.findOne({
        'email': email
    }).then((user)=> {
        if (!user) {
            return Promise.reject({err: "Cannot find email"});
        }

        return new Promise((resolve, reject)=> {
            
            bcrypt.compare(password, user.password, (err, res)=> {
              if (res) resolve(user);
              reject({"err": "Password is incorrect"});
            });
        });

        // console.log(user);
    });

    // bcrypt.genSalt(10, (err, salt) => {
    //     bcrypt.hash(password, salt, (err, hash)=> {
    //         // console.log(`email = ${email} salt and hashed password = ${hash}`);
    //         bcrypt.compare(password, hash, (err, res)=> {
    //             console.log(res);
    //             console.log(hash);
    //         });
    //     });
    // });
};

var User = mongoose.model('Users', UserSchema);

module.exports = {User};