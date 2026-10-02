const connectDB = require("./middlewares/connectMongo");
const User = require("./models/user");
const mongoose = require("mongoose");

require("dotenv").config();

connectDB(process.env.MONGO_URL);

async function test() {

    try{
        const users = await User.find({});
        console.log(users);
    }catch(e){
        console.log("Fat Gaya !!");
    }
    
}

test();