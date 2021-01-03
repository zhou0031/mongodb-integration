const express = require('express')
const router  = express.Router()
const {ROLE, users} = require('../data')


router.get('/',(req,res)=>{
    res.render('admin/index',{"title":"Admin panel（管理员界面）"})
})

module.exports = router