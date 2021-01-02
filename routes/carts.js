const express = require('express')
const router  = express.Router()
const {carts} = require('../authData')
const {authUser}=require('../auth')
const {canViewCart}=require('../permissions/cart')

router.get('/',(req,res)=>{
    res.json(carts)
})

router.get('/:cartID', setCart, authUser,authGetCart,(req,res)=>{
    res.json(req.cart)
})

function setCart(req,res,next){
    const cartID=parseInt(req.params.cartID)
    req.cart=carts.find(cart=>cart.id===cartID)
    if(req.cart==null){
        res.status(404)
        return res.send('Cart not found')
    }
    next()
}

function authGetCart(req,res,next){
    if(!canViewCart(req.user,req.cart)){
        res.status(401)
        return res.send('Not allowed')
    }
    next()
}

module.exports = router