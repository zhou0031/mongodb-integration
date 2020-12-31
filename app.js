if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express=require('express')
const app=express()
const indexRouter=require('./routes/index')

//App
app.set('view engine', 'pug')
app.set('views',__dirname+'/views')
app.use(express.static('public'))
app.use(express.static('files'))
app.use(express.json())

//MongoDB
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL,{useUnifiedTopology: true, useNewUrlParser: true})
const db=mongoose.connection
db.on('error',error=>console.error(error))
db.once('open',()=>console.log('Connected to Mongoose'))

//Routes
app.use('/',indexRouter)

app.listen(process.env.PORT||3000)
