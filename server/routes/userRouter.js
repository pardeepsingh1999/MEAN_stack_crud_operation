const express = require('express');
const router = express.Router();
const mime = require('mime');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const axios = require('axios');
const mkdirp = require('mkdirp');

const userSchema = require('../models/userModel');
const config = require('../config/config');
const { exec } = require('child_process');

const uploadImage = async (req, res, next) => {
    // to declare some path to store your converted image
    let userId = req.body.userId;
    var matches = req.body.base64image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};
     
    if (matches.length !== 3) {
    return new Error('Invalid input string');
    }
     
    response.type = matches[1];
    response.data = new Buffer.from( matches[2], 'base64');
    // console.log(response.data)
    let decodedImg = response;
    let imageBuffer = decodedImg.data;
    let type = decodedImg.type;
    let extension = mime.getExtension(type);
    let fileName = "image." + extension;
    try {
    fs.writeFileSync("public/userImage/" + userId + "/" + fileName, imageBuffer, 'utf8');
    userSchema.findByIdAndUpdate(userId, {$set:{userImage: fileName}}).exec()
    .then(setImage => console.log('Done'))
    return res.send("success");
    } catch (e) {
    next(e);
    }
}

router.post('/image', uploadImage);

router.post('/register', (req, res) => {
    
    let { name } = req.body;
    let { email } = req.body;
    let { password } = req.body;
    let { gender } = req.body;
    let { userImage } = req.body;

    userSchema.countDocuments( (err, count) => {
        if(count > 0) {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    userSchema.create({
                        name: name,
                        email: email,
                        gender: gender,
                        password: hash,
                        saltSecret: salt
                    })
                    .then(u => {
                            mkdirp.sync('public/userImage/' + u._id);
                            if(userImage) {
                                axios.post(`http://localhost:${config.port}/api/user/image`, {
                                    userId: u._id,
                                    base64image: userImage
                                })
                                .then( response => {
                                    // console.log(response)
                                    res.status(200).json({
                                    msg: 'Successfully Registered',
                                    register: u
                                    });
                                })
                                .catch(err => res.send(err))
                        } else {
                            res.status(200).json({
                                msg: 'Successfully Registered',
                                register: u
                            });
                        }
                    })
                    .catch(err => {
                        if(err.code == 11000) {
                            res.status(422).send(['Duplicate email address found'])
                        } else {
                            // let valErrors = [];
                            // Object.keys(err.error).forEach(key => valErrors.push(err.errors[key].message));
                            res.status(501).send(err.name)
                        }
                    })
                })
            })
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    userSchema.create({
                        name: name,
                        email: email,
                        gender: gender,
                        password: hash,
                        admin: true,
                        saltSecret: salt
                    })
                    .then(u => {
                            mkdirp.sync('public/userImage/' + u._id);
                            if(userImage) {
                                axios.post(`http://localhost:${config.port}/api/user/image`, {
                                    userId: u._id,
                                    base64image: userImage
                                })
                                .then( response => {
                                    // console.log(response)
                                    res.status(200).json({
                                    msg: 'Successfully Registered',
                                    register: u
                                    });
                                })
                                .catch(err => res.send(err))
                        } else {
                            res.status(200).json({
                                msg: 'Successfully Registered',
                                register: u
                            });
                        }
                    })
                    .catch(err => {
                        if(err.code == 11000) {
                            res.status(422).send(['Duplicate email address found'])
                        } else {
                            // let valErrors = [];
                            // Object.keys(err.error).forEach(key => valErrors.push(err.errors[key].message));
                            res.status(501).send(err.name)
                        }
                    })
                })
            })
        }
    })
    
});
     

module.exports = router;