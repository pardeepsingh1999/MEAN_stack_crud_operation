const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 3,
        maxlength: 20
    },
    email: { 
        type: String, 
        required: true,
        unique: true
    },
    gender: { 
        type: String, 
        required: true
    },
    userImage:{
        type:String
    },
    admin: { 
        type: Boolean, 
        default: false 
    },
    password: { 
        type: String, 
        required: true,
        minlength: [4, 'Password must be atleast 4 character long']
    },
    saltSecret: String
},
{ collection: 'user', timestamps: true });

module.exports = mongoose.model('user', userSchema);