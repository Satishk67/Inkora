
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./middlewares/connectMongo");
const Blogs = require("./models/blog");

connectDB(process.env.MONGO_URL)

async function op() {
    try{
        await Blogs.deleteOne({_id : "6a9718d1f65e4309768e8159"});
        console.log("Success");
    }
    catch(e){
        console.log(e);
    }
}

op();