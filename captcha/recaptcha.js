const { URLSearchParams } = require('url');
const fetch = require('node-fetch')

//Validate Google recaptcha
async function validateRecaptcha(req,res,next){
    const captcha = req.body['g-recaptcha-response']
    const params = new URLSearchParams();
    let result

    params.append('response',captcha)
    params.append('secret',process.env.RECAPTCHA_V2_SECRET_KEY)
    
    try{
        result = await fetch(process.env.RECAPTCHA_SITE_VERIFY,{ 
        method:"post",
        body:params}).then(res => res.json())
    }catch(error){
        console.log(error)
    }
    res.captcha=result?result.success:false
    next()
}

module.exports = {
    validateRecaptcha
}