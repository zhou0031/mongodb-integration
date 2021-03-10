const httpServer = require("http").createServer()
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
 httpServer.listen(3001,()=>{
     console.log("chat server on 3001")
 })

