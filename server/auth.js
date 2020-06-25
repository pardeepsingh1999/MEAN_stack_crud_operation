const passport = require("passport");
const config = require('./config/config');
const jwt = require('jsonwebtoken');

module.exports.authenticate = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) return res.status(400).json(err);
        else if(user) return res.status(200).json({
            "loginToken": jwt.sign(
                {
                  userId: user._id,
                  name: user.name
                },
                config.jwt_secrect_key,
                {
                  expiresIn: config.jwt_expiresIn
                }
              )
        });
        else return res.status(404).json(info)
    })(req, res);
};

module.exports.verifyJwtToken = (req, res, next) => {
    function verifyUser(token) {
        jwt.verify(token, config.jwt_secrect_key, (err, decode) => {
            if(err){
                console.log(err);
                res.json({ msg: 'Auth Failed!!'})
            } else {
                req.user = decode;
                next();
            }
        })
    }
    if(req.headers.authorization) {
        try {
            const getToken = req.headers.authorization.split(' ');
            getToken[0] == 'Bearer'
                ? verifyUser(getToken[1])
                : res.json({ msg: 'Bearer token is not present in the authorization' });
        } catch (error) {
            console.log(error);
            res.json({ msg: 'Auth Failed!!' })
        }
    } else {
        res.json({ msg: 'Authorisation header is not present'});
    }
};