const express = require('express')
const router  = express.Router()
const {authUser, authRole} = require('../auth')
const {ROLE} = require('../data')

router.get('/',(req,res)=>{
    res.render('admin/login',{"title":"Admin panel（管理员界面）"})
})

router.get('/index',authUser,authRole(ROLE.ADMIN),(req,res)=>{
    res.render('admin/index')
})

module.exports = router