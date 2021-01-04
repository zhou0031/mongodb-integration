const express = require('express')
const router  = express.Router()

router.get('/',(req,res)=>{
    res.render('admin/login',{"title":"Admin panel（管理员界面）"})
})

module.exports = router