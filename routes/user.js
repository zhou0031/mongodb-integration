const express               = require('express')
const router                = express.Router()
const methodOverride        = require('method-override')
const {ROLE}                = require('../data')
const {authRole}            = require('../auth')
const bcrypt                = require('bcrypt')
const BasicUser             = require('../models/basicUser')
const emailValidator        = require('email-validator')
const {validateRecaptchaV2,validateRecaptchaV3}   = require('../captcha/recaptcha')
const {RECAPTCHA}           = require('../data')
const {setGoogleUser}       = require('./user/helper')


//google user route used for checkiing google id token
const googleRoute=require('./user/google')
router.use("/google",googleRoute)


router.use(methodOverride('_method'))
//deseriazlize user
router.use(setBasicUser)
router.use(setGoogleUser)


/******************* Router ******************/
//signup page
router.get('/signup',checkNotAuthenticated, (req,res)=>{
    res.render('user/signup', 
    {
        basicUser: new BasicUser(),
        title:"Sign up 注册新会员"
    })
})

//user signup
router.post('/signup',validateRecaptchaV2,signup_handleRecaptcha,validateBasicSignup,isUserExisted,signup_handleUserExisted,async(req,res)=>{

    try{
        const hashedPassword = await bcrypt.hash(req.body.password1,10)
        const user = new BasicUser({email:req.body.email,password:hashedPassword})
        await user.save()
        res.redirect('/user')
    }catch{
        console.log("An error occured in creating a new user / 创建新用户出错")
        res.redirect('/user/signup')
    }
})

//login page
router.get('/',checkNotAuthenticated,(req,res)=>{
    return res.render('user/login',{title:"Sign in / 欢迎登入"})
})

//login user
router.post('/',validateRecaptchaV3,login_handleRecaptcha,async(req,res)=>{
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

//logout user
router.delete('/',(req,res)=>{
    delete req.session.basicUser
    res.redirect('/user')
})

//dashboard
router.get('/index', checkAuthenticated, authRole(ROLE.BASIC), (req,res)=>{
    return res.render('user/index',{
        email:req.user.email
    })
})


/********************************* Functions ************************************/
//if captcha failed, re-login
function login_handleRecaptcha(req,res,next){
    if(res.captcha<RECAPTCHA.MIN_SCORE){
        let errorMessages=[]
        email = req.body.email
        errorMessages.push("Pass recaptcha test / 需通过人机身份验证")
        return res.status(401).render("user/login",{
            email:email,
            title: "Sign in 欢迎登入 Recaptcha Test / 人机身份验证",
            errorMessages:errorMessages
        })
    }
    next()
}

//if captcha test failed, re-sign up
function signup_handleRecaptcha(req,res,next){
    if(!res.captcha){
        let errorMessages=[]
        email = req.body.email
        errorMessages.push("Pass recaptcha test / 需通过人机身份验证")
        return res.status(401).render("user/signup",{
            basicUser:new BasicUser({email:email}),
            title: "Sign up 注册新会员 Recaptcha Test / 人机身份验证",
            errorMessages:errorMessages
        })
    }
    next()
}

//validate basic signup inputs
function validateBasicSignup(req,res,next){
    let errorMessages=[]
    const {email,password1,password2}=req.body
    if(!emailValidator.validate(email))
        errorMessages.push("Enter a valid email / 请输入有效邮箱")
   
    if(password1=="" || password2=="")
        errorMessages.push("Enter passwords / 请正确输入密码")  
    else if(password1!==password2)
        errorMessages.push("Passwords don't match / 密码不一致")

    if(errorMessages.length>0){
        return res.render("user/signup",{
            basicUser:new BasicUser({email:email}),
            title: "Sign up 注册新会员 Validation / 验证",
            errorMessages:errorMessages
        })
    }
    next()
}

//Check if user is already signed up in database
async function isUserExisted(req,res,next){
    try{  
        const basicUser = await BasicUser.findOne({email:req.body.email})
        if (basicUser !== null){
           res.basicUser=basicUser
        }
        next()
    }catch(error){
        console.log(error)
        res.status(500)
        return res.send("An error occured on server / 服务器出现故障")
    }
}

//if user existed, re-render signup page with error message 
function signup_handleUserExisted(req,res,next){
    if(res.basicUser){//user already existed
        return res.render("user/signup",{
            errorMessages:["User already existed / 用户已存在"],
            title:`Sign up 注册新会员 - ${res.basicUser.email} User already existed / 用户已存在`,
            basicUser:new BasicUser({email:res.basicUser.email})
        })
    }
    next()
}

//set current user
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

/*
If not authenticated, 
redirect to user login page 
which is at "/user" path
Otherwise, continue to user content page
*/
function checkAuthenticated(req,res,next){
    if(req.session.basicUser!=null){
        return next()
    }
    if(req.session.googleUser!=null){
        return next()
    }
    res.redirect('/user')
}

/*
If authenticated, redirect to user content page
Otherwise, continue on. 
This is userful when user already login, 
otherwise go back to login page at "/user" path
*/
function checkNotAuthenticated(req,res,next){
    if(req.session.basicUser!=null){
        return res.redirect('/user/index')
    }
    if(req.session.googleUser!=null){
        return res.redirect('/user/index')
    }
    next()
}


//Modue export
module.exports = router