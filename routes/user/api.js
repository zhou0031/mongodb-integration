const express  = require('express')
const router = express.Router()
const methodOverride  = require('method-override')
const {apiAuthUser} = require("../../auth")
const jwt = require("jsonwebtoken")                  


router.use(methodOverride('_method'))


router.get('/getUser',apiAuthUser,(req,res)=>{
    const user = req.user
    const userAccessToken = jwt.sign(user.toJSON(),process.env.JWT_ACCESS_TOKEN_SECRET)
    res.json({userAccessToken:userAccessToken})
})


//Module export
module.exports = router