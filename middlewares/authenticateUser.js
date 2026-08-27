const { getUser } = require("../services/auth");

function checkForAuthenticationCookie(cookieName){
    return (req,res,next)=>{
        const tokenValue = req.cookies[cookieName];
        if(!tokenValue) return next();

        try{
            const payload = getUser(tokenValue);
            req.user = payload;
        }catch(e){}

        return next();
    }
}

module.exports = {
    checkForAuthenticationCookie
}