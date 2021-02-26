const mongoose = require('mongoose')
const {ROLE} = require("../data")

const googleUserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    google_id:{
        type:String,
        required:true,
        unique:true
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


module.exports = mongoose.model('GoogleUser', googleUserSchema)