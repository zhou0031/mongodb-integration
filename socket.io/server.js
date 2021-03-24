if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const app = express() 
const httpServer = require('http').Server(app)
const cors = require('cors')
const jwt = require('jsonwebtoken')
const {apiAuthUser} = require("../auth")
const io = require("socket.io")(httpServer,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
})

/*********************************************************************** */
io.on("connection", socket => { 
    console.log(`${socket.id} connected`)
    
    socket.on('chat-message', (message) => {
        io.emit('chat-message', message)
    })
        
   
   





    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
    socket.onAny((event, ...args) => {
        console.log(event, args);
    })
 })
/************************************************************************* */
app.use(express.json())

app.options('*', cors())

app.post("/signin",verifyUserToken,(req,res)=>{
    
})

/**************** Functions ******************* */
async function verifyUserToken(req,res,next){
    const token = req.body.userAccessToken
    try{ 
        const user = await jwt.verify(token,process.env.JWT_ACCESS_TOKEN_SECRET)
    }catch(error){
        console.log("Error: "+error)
    }
    next()
}


 httpServer.listen(3001,()=>{
     console.log("chat server on 3001")
 })

