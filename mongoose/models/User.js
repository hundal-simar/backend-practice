const mongoose= require('mongoose');

const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minlength:2,
        maxlength:50
    },
    lastName:{
        type:String,
        required:true,
        minlength:2,
        maxlength:50
    },
    email:{
        type:String,
        required:true,
        match:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
   },
    {
        timestamps: true
    }
)

userSchema.pre('save', function(){
    this.email=this.email.toLowerCase().trim()
    })

userSchema.virtual('fullName').get(function(){
    return `${this.firstName} ${this.lastName}`
})

const User= new mongoose.model('User', userSchema)

module.exports=User