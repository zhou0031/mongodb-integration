const express = require('express')
const router  = express.Router()
const methodOverride = require('method-override')
const {ROLE} = require('../data')
const {authRole} = require('../auth')
const bcrypt = require('bcrypt')
const BasicUser = require('../models/basicUser')
const jwt = require('jsonwebtoken')


router.use(methodOverride('_method'))


//Router
router.get('/signup',checkNotAuthenticated, (req,res)=>{
    res.render('user/signup', {basicUser: new BasicUser()})
})

router.post('/signup',isUserExisted, async(req,res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        const user = new BasicUser({email:req.body.email,password:hashedPassword})
        await user.save()
        res.redirect('/user')
    }catch{
        console.log("An error occured in creating a new user/ 创建新用户出错")
        res.redirect('/user/signup')
    }
})

router.get('/',checkNotAuthenticated,(req,res)=>{
    return res.render('user/login',{title:"Sign in / 欢迎登入"})
})

router.post('/login',async(req,res)=>{
    let errorMessages=[]
    try{
        const user = await BasicUser.findOne({email:req.body.email})
        if(user==null) {
            errorMessages.push('Can not find user / 用户不存在')
            return res.status(403).render("user/login",{
                email:req.body.email,
                errorMessages:errorMessages
            })
        }

        if(await bcrypt.compare(req.body.password, user.password)){
            //remove password key/value
            let aUser = user.toObject()
            delete aUser.password
            
            //genereate jwt token
            const accessToken = jwt.sign(aUser, process.env.ACCESS_TOKEN_SECRET)
            res.json({accessToken:accessToken})
        }else{
            //password incorrect
            errorMessages.push("Password incorrect / 密码错误")
            return res.status(401).render("user/login",{
                email:req.body.email,
                errorMessages:errorMessages
            })
        }
    }catch(error){
        console.log(error)
        return res.status(500).send("An error occured on server / 服务器出现故障")
    }
})

router.get('/index', authenticateToken, authRole(ROLE.BASIC), (req,res)=>{
    return res.send(req.user)
})


/******************* Functions *******************/
//Check if user is already signed up in database
async function isUserExisted(req,res,next){
    try{
        const basicUser = await BasicUser.findOne({email:req.body.email})
        if (basicUser !== null){
            return res.render('user/signup',{
                basicUser:basicUser,
                errorMessage:"User already existed / 此用户已存在"
            })
        }
        next()
    }catch(error){
        console.log(error)
        res.status(500)
        return res.send("An error occured on server / 服务器出现故障")
    }
}

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token==null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

/*
If authenticated, redirect to user content page
Otherwise, continue on. 
This is userful when user already login, 
otherwise go back to login page at "/user/login" path
*/
function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
       return res.redirect('/user/index')
    }
    next()
}


//Modue export
module.exports = router