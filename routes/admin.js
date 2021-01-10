const express = require('express')
const router  = express.Router()
const methodOverride = require('method-override')
const {ROLE} = require('../data')
const {authRole} = require('../auth')


router.use(methodOverride('_method'))


//Passport 
const passport = require('passport')
const { initializePassportAdmin } = require('../passport-config')
const AdminUser = require('../models/adminUser')
initializePassportAdmin(
    passport,
    username=> AdminUser.findOne({username:username}),
    id => AdminUser.findById(id)
)


//Routes
router.get('/',checkNotAuthenticated,(req,res)=>{
    res.render('admin/login',{"title":"Admin panel（管理员界面）"})
})

router.post('/login',passport.authenticate('local',{
    successRedirect:'/admin/index',
    failureRedirect:'/admin',
    failureFlash:true
}))

router.delete('/logout',(req,res)=>{
    req.logOut()
    res.redirect('/admin')
})

router.get('/index',checkAuthenticated,authRole(ROLE.ADMIN),(req,res)=>{
    res.render('admin/index',
    {
        "name":req.user.name,
        "title":"Admin panel（管理员界面）"
    })
})
    

//Functions
/*
If not authenticated, 
redirect to admin login page 
which is at "/admin" path
Otherwise, continue to admin content page
*/
function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/admin')
}

/*
If authenticated, redirect to admin content page
Otherwise, continue on. 
This is userful when admin already login, 
otherwise go back to login page at "/admin" path
*/
function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
       return res.redirect('/admin/index')
    }
    next()
}


//export module
module.exports = router