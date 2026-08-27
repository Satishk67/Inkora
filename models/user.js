
const {Schema, model} = require("mongoose");
const { randomBytes, createHmac } = require("crypto");

const userSchema = new Schema({
    userName : {
        type : String,
        required : true,
        unique : true,
    },
    fullName : {
        type : String,
        required : true,
    },
    gender : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    salt : {
        type : String,
    },
    // For Hashing
    password : {
        type : String,
        required : true,
    },
    profilePicture : {
        type : String,
        default : "/images/defaultProfilePic.svg"
    },
    role : {
        type : String,
        enum : ["USER","ADMIN"],
        default : "USER"
    }
}, {timestamps : true});


// Hash the password before required-field validation runs.
userSchema.pre("save", function () {
    const user = this;

    if(!user.isModified("password")) return ;

    // create a unique salt for user 16 digits
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256",salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;
})

const User = model("User",userSchema);

module.exports = User;