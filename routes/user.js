
const express = require('express')
const router  = express.Router()
const methodOverride = require('method-override')
const {ROLE} = require('../data')
const {authRole} = require('../auth')
const bcrypt = require('bcrypt')
const BasicUser = require('../models/basicUser')


router.use(methodOverride('_method'))


//Passport 
const passport = require('passport')
const { initializePassportBasic } = require('../passport-config')
initializePassportBasic(
    passport,
    email=> BasicUser.findOne({email:email}),
    id => BasicUser.findById(id)
)


//Router
router.get('/signup',(req,res)=>{
    res.render('user/signup', {basicUser: new BasicUser()})
})

router.post('/signup',isUserExisted, async(req,res)=>{

    await bcrypt.hash(req.body.password,10, async (error, hashedPassword)=>{
        if(error){
            return res.render('user/signup',{
            errorMessage:"Password error occured in creating a new user / 密码加密出错，请再试一次"
            })
        }

        const basicUser = new BasicUser({ 
            email: req.body.email,
            password: hashedPassword
        })

        await basicUser.save((error)=>{
            if(error){
                return res.render('user/signup',{
                    basicUser: basicUser,
                    errorMessage: "An error occured in creating a new user ／ 系统创建新用户没成功，再试一次"
                })
            }
            res.redirect('/user')    
        })
    })
})

router.post('/login',
    (req,res,next)=>{
        req.session.email=req.body.email
        next()
    },
    passport.authenticate('localBasicUser',{
    successRedirect:'/user/index',
    failureRedirect:'/user',
    failureFlash:true
}))

router.get('/index',checkAuthenticated,authRole(ROLE.BASIC),(req,res)=>{
    return res.send('user index page')
})

router.get('/',checkNotAuthenticated,(req,res)=>{
    return res.send('user login page')
})


//Functions
async function isUserExisted(req,res,next){
    if(await BasicUser.findOne({email:req.body.email})){
        const basicUser = new BasicUser({email:req.body.email})
        return res.render('user/signup',{
            basicUser:basicUser,
            errorMessage:"User already existed / 此用户已存在"
        })
    }
    next()
}

/*
If not authenticated, 
redirect to user login page 
which is at "/user/login" path
Otherwise, continue to user content page
*/
function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
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
    if(req.isAuthenticated()){
       return res.redirect('/user/index')
    }
    next()
}


//Modue export
module.exports = router