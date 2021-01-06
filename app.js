if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const app = express()
const passport = require('passport')
const {authUser} = require('./auth')
const {users} = require('./data')
const flash = require("express-flash")
const session = require("express-session")


//App
app.set('view engine', 'pug')
app.set('views',__dirname+'/views')
app.use(express.static('public'))
app.use(express.static('files'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(setUser)



//MongoDB
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL,{useUnifiedTopology: true, useNewUrlParser: true})
const db=mongoose.connection
db.on('error',error=>console.error(error))
db.once('open',()=>console.log('Connected to Mongoose'))


//Routes
const indexRouter = require('./routes/index')
const adminRouter = require('./routes/admin')
const cartsRouter  = require('./routes/carts')
app.use('/',indexRouter)
app.use('/admin',adminRouter)
app.use('/carts',authUser,cartsRouter)


//Set user (Application-level middleware)
function setUser(req, res, next) {
    const userID = req.body.userID
    if (userID) {
      req.user = users.find(user => user.id === userID)
    }
    next()
}


//Port listening
app.listen(process.env.PORT||3000)
