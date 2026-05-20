const mongoose= require('mongoose');

const projectSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    }
},
 {
    timestamps: true
 }

)

const Project= mongoose.model('Project', projectSchema)
module.exports=Project