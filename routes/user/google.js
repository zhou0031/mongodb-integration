const express               = require('express')
const router                = express.Router()
const {OAuth2Client}        = require('google-auth-library');
const client                = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID);


router.post('/verifyGoogleIdToken', async(req,res)=>{
    try{
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_AUTH_CLIENT_ID,  
            
        })
        const payload = ticket.getPayload()
        const userid = payload['sub']
    }catch(error){
        console.log(error)
    }
})


//Modue export
module.exports = router