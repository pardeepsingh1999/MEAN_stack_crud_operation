const express = require('express');
const router = express.Router();

const auth = require('../auth');

const user = require('./userRouter');
const userProfile = require('./userProfileRouter');


router.use('/user', user);
router.use('/auth', auth.authenticate);
router.use('/userProfile', auth.verifyJwtToken, userProfile)


module.exports = router;