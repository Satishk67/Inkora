
const mongoose = require("mongoose")

function connectDB(URL) {

    mongoose.connect(URL)
    .then((e) => {console.log("MongoDB connected...")})
    .catch((e) => {console.log(`MogoDB error : ${e}`)});
    
}

module.exports = connectDB;