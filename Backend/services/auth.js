
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;


function setUser(user){
    // Create token
    const payload= {
        _id : user._id,
        userName : user.userName,
        email : user.email,
        profilePicture: user.profilePicture,
        role : user.role,
    }

    const  token = jwt.sign(payload,secret,{expiresIn : "7d"});
    return token;
}

function getUser(token){
    const payload = jwt.verify(token,secret);
    return payload;
}

module.exports = {
    setUser,
    getUser,
}