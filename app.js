if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const app = express()
const passport = require('passport')
const bodyParser= require('body-parser')
const {authUser} = require('./auth')
const flash = require("express-flash")
const session = require("express-session")


//App
app.set('view engine', 'pug')
app.set('views',__dirname+'/views')
app.use(express.static('public'))
app.use(express.static('files'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({ limit:"1mb", extended:false }))
app.use(flash())
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())


//MongoDB
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL,{
  useUnifiedTopology: true, 
  useNewUrlParser: true,
  useCreateIndex:true})
const db=mongoose.connection
db.on('error',error=>console.error(error))
db.once('open',()=>console.log('Connected to Mongoose'))


//Routes
const indexRouter = require('./routes/index')
const adminRouter = require('./routes/admin')
const userRouter  = require('./routes/user')
const cartRouter  = require('./routes/cart')
app.use('/',indexRouter)
app.use('/admin',adminRouter)
app.use('/user',userRouter)
app.use('/cart',authUser,cartRouter)


//Port listening
app.listen(process.env.PORT||3000)
