const express = require('express');
const router = express.Router();
const _ = require('lodash');

const userSchema = require('../models/userModel');

router.get('/', (req, res) => {
    userSchema.findOne({_id: req.user.userId}).exec()
    .then(user => {
        if(!user) {
            res.status(404).json({ msg: 'User record not found.'});
        } else {
            if(user.admin) {
                userSchema.find({_id:{'$ne':user._id}})
                .select('_id name email gender userImage')
                .then(ui => {
                    res.status(200).json({ 
                        user: _.pick(user, ['_id','name', 'admin', 'email', 'gender', 'userImage']),
                        multiUser: ui
                    });
                })
            } else {
                res.status(200).json({ user: _.pick(user, ['_id','name', 'email', 'gender', 'userImage']) });
            }
        }
    })
});

module.exports = router;