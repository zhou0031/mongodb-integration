const express = require('express')
const router  = express.Router()
const methodOverride = require('method-override')
const {ROLE} = require('../data')
const {authRole} = require('../auth')
const bcrypt = require('bcrypt')
const BasicUser = require('../models/basicUser')


router.use(methodOverride('_method'))
//deseriazlize user
router.use(async(req,res,next)=>{
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
})


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

router.post('/',async(req,res)=>{
    let errorMessages=[]
    let user
    try{
        user = await BasicUser.findOne({email:req.body.email})
        if(await bcrypt.compare(req.body.password, user.password)){
            //serialize user 
            req.session.basicUser={"user":user.id}
            res.redirect('/user/index')
        }else{
            //password incorrect
            errorMessages.push("Password incorrect / 密码错误")
            return res.status(401).render("user/login",{
                email:req.body.email,
                errorMessages:errorMessages
            })
        }
    }catch(error){
        if(user==null) {
            errorMessages.push('User does not exist / 无此用户')
            return res.status(403).render("user/login",{
                email:req.body.email,
                errorMessages:errorMessages
            })
        }
        console.log(error)
        return res.status(500).send("An error occured on server / 服务器出现故障")
    }
})

router.delete('/',(req,res)=>{
    delete req.session.basicUser
    res.redirect('/user')
})


router.get('/index', checkAuthenticated, authRole(ROLE.BASIC), (req,res)=>{
    return res.render('user/index',{
        email:req.user.email
    })
})


/********************************* Functions ************************************/
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

/*
If not authenticated, 
redirect to admin login page 
which is at "/admin" path
Otherwise, continue to admin content page
*/
function checkAuthenticated(req,res,next){
    if(req.session.basicUser!=null && req.user!=null){
        return next()
    }
    res.redirect('/user')
}

/*
If authenticated, redirect to user content page
Otherwise, continue on. 
This is userful when user already login, 
otherwise go back to login page at "/user/login" path
*/
function checkNotAuthenticated(req,res,next){
    if(req.session.basicUser!=null && req.user!=null){
       return res.redirect('/user/index')
    }
    next()
}


//Modue export
module.exports = router