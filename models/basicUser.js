const mongoose = require('mongoose')
const {ROLE} = require("../data")


const basicUserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:ROLE.BASIC
    },
    canPost:{
        type:Boolean,
        required:true,
        default:true
    },
    canChat:{
        type:Boolean,
        required:true,
        default:false
    },
    createdOn:{
        type:Date,
        default:Date.now
    }

})


module.exports = mongoose.model('BasicUser', basicUserSchema)