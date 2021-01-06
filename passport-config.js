const LocalAdminStrategy = require('passport-local').Strategy
const bcrypt = require ('bcrypt')


function initializePassportAdmin(passport,getUserByUsername,getUserByID){
    
    const authenticateAdmin = async(username, password, done) => {
        const admin = getUserByUsername(username)
        if(admin == null){
            return done(null,false,{message:"No admin with that username / 管理员用户名不存在"})
        }
        //admin username is right
        try{
            if(await bcrypt.compare(password, admin.password)){//find admin user
                return done(null, admin)
            } else {//admin password didn't match
                return done(null,false,{message: "Admin password incorrect / 管理员密码有错"})
            }
        }catch(e){
            return done(e)
        }
    }

    passport.use(new LocalAdminStrategy({
        usernameField:"username"
    },authenticateAdmin))

    passport.serializeUser((admin,done)=>done(null, admin.id))
    passport.deserializeUser((id,done)=>{
        return done(null,getUserByID(id))
    })

}

module.exports =  initializePassportAdmin
