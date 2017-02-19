var {User} = require('./../models/user');

// Request middleware with the params
var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

    User.findByToken(token).then((user)=> {
        if(!user) {
            return Promise.reject('Cannot authenticate');
        }

        req.user = user;
        req.token = token;
        next();
    }).catch((err)=> {
        res.status(401).send({'error': err});
    });
};

module.exports = {authenticate};