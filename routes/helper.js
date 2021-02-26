const BasicUser = require('../models/basicUser')
const GoogleUser  = require('../models/googleUser')


async function setBasicUser(req,res,next){
    if(req.session.basicUser!=null){
        try{
            const user = await BasicUser.findById(req.session.basicUser.user)
            req.user=user
        }catch{
            console.log("An error occured in searching for user / 服务器查找用户出错")
            return res.status(500).send("An error occured on server / 服务器出现故障")
        }
    }
    next()
}

async function setGoogleUser(req,res,next){
    if(req.session.googleUser!=null){
        try{
            const user = await GoogleUser.findOne({google_id:req.session.googleUser.user})
            req.user=user
        }catch{
            console.log("An error occured in searching for user / 服务器查找用户出错")
            return res.status(500).send("An error occured on server / 服务器出现故障")
        }
    }
    next()
}


module.exports = {
    setBasicUser,
    setGoogleUser
}