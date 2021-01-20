
const express = require('express')
const router  = express.Router()
const methodOverride = require('method-override')
const {ROLE} = require('../data')
const {authRole} = require('../auth')
const bcrypt = require('bcrypt')
const BasicUser = require('../models/basicUser')


router.use(methodOverride('_method'))


//Router
router.get('/signup',checkNotAuthenticated, (req,res)=>{
    res.render('user/signup', {basicUser: new BasicUser()})
})

router.post('/signup',isUserExisted, async(req,res)=>{
   
})

router.get('/',checkNotAuthenticated,(req,res)=>{
    return res.render('user/login',{title:"Sign in / 欢迎登入"})
})

router.post('/login',(req,res)=>{
    res.send('post to login')
})

router.get('/index', checkAuthenticated, authRole(ROLE.BASIC), (req,res)=>{
    return res.send('user index page')
})


//Functions
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
        res.status(503)
        res.send("An error occured on server / 服务器出现故障")
    }
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