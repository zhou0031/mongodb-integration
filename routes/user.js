
const express = require('express')
const router  = express.Router()
const methodOverride = require('method-override')
const {ROLE} = require('../data')
const {authRole} = require('../auth')


//Passport 
const passport = require('passport')
const { initializePassportBasic } = require('../passport-config')
const BasicUser = require('../models/basicUser')
initializePassportBasic(
    passport,
    email=> BasicUser.findOne({email:email}),
    id => BasicUser.findById(id)
)


//Router
router.post('/login',
    (req,res,next)=>{
        req.session.email=req.body.email
        next()
    },
    passport.authenticate('local',{
    successRedirect:'/user/index',
    failureRedirect:'/user/login',
    failureFlash:true
}))

router.get('/index',checkAuthenticated,authRole(ROLE.BASIC),(req,res)=>{
    return res.send('user index page')
})

router.get('/login',checkNotAuthenticated,(req,res)=>{
    return res.send('user login page')
})


//Functions
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
    res.redirect('/user/login')
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