const express               = require('express')
const router                = express.Router()
const methodOverride        = require('method-override')


router.use(methodOverride('_method'))


router.get('/',(req,res)=>{
    console.log("api route")
})


//Module export
module.exports = router