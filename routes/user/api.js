const express  = require('express')
const router = express.Router()
const methodOverride  = require('method-override')
const {apiAuthUser} = require("../../auth")
const jwt = require("jsonwebtoken")                  
const redis = require("redis")


//redis database
const redisClient = redis.createClient({
    password:process.env.REDIS_PASSWORD
})
redisClient.on("error", function(error) {
  console.error(error);
});


router.use(methodOverride('_method'))


router.post('/signin',apiAuthUser, (req,res)=>{
    const user = req.user
    const userAccessToken = generateUserAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    redisClient.lpush("refreshtokens",refreshToken)
    res.json({userAccessToken,refreshToken})
})


/*************** Functions *****************/
function generateUserAccessToken(user){
    return  jwt.sign(user.toJSON(),process.env.JWT_ACCESS_TOKEN_SECRET,{expiresIn:"10s"})
}

function generateRefreshToken(user){
    return  jwt.sign(user.toJSON(),process.env.JWT_REFRESH_TOKEN_SECRET)
}


//Module export
module.exports = router