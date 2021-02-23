const express               = require('express')
const router                = express.Router()
const BasicUser             = require('../../models/basicUser')
const {OAuth2Client}        = require('google-auth-library');
const client                = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID);


router.post('/verifyGoogleIdToken', async(req,res)=>{
    const token = req.body.id_token
    
    try{
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_AUTH_CLIENT_ID
        })
        const payload = ticket.getPayload()
        
        if(payload['aud']==process.env.GOOGLE_AUTH_CLIENT_ID)
            return res.json(payload)
        else
            res.status(401).send("the app is not intended for the user 客户端请求与Client ID 不符（GOOGLE_AUTH_CLIENT_ID）")
    }catch(error){
        console.log(error)
    }
})




//Modue export
module.exports = router