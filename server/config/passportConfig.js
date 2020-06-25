const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

let userSchema = require('../models/userModel');

passport.use(
    new localStrategy({ usernameField: 'email'},
        (username, password, done) => {
            userSchema.findOne({email: username}).exec()
            .then(user => {
                if(!user) {
                    return done(null, false, { msg: 'Email is not found!' })
                }

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) console.log(err)

                    if(isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false, { msg: 'Wrong password.'})
                    }
                })
            })
            .catch(err => {
                return done(err)
            })
        })
)