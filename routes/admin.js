const express = require('express')
const router  = express.Router()
const {authUser, authRole} = require('../auth')
const {ROLE, users} = require('../data')


const passport = require('passport')
const initializePassportAdmin = require('../passport-config')
initializePassportAdmin(
    passport, 
    username => users.find(user => user.username === username),
    id => users.find(user=>user.id === id)
)

router.get('/',(req,res)=>{
    res.render('admin/login',{"title":"Admin panel（管理员界面）"})
})

router.post('/login',passport.authenticate('local',{
    successRedirect:'/admin/index',
    failureRedirect:'/admin',
    failureFlash:true
}))


router.get('/index',authUser,authRole(ROLE.ADMIN),(req,res)=>{
    res.render('admin/index')
})

module.exports = router