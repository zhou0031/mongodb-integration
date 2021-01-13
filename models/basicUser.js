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
    name:{
        type:String,
        required:false
    }

})


module.exports = mongoose.model('BasicUser', basicUserSchema)