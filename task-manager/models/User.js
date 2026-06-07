const mongoose = require('mongoose');

const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    refreshToken: {
        type: String,
        select: false
    }
},
    {
        timestamps: true
    }
)

userSchema.set('toJSON',{
    transform(doc, ret){
        delete ret.password;
        delete ret.refreshToken;
        return ret;
    }
})

const User= mongoose.model('User', userSchema)
module.exports=User