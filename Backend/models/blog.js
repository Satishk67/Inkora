
const {Schema, mongoose, model} = require("mongoose");

const blogSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    thumbnail : {
        type : String,
        default : "/images/default_thumbnail.jpg",
    },
    category : {
        type : String,
        required : true,
    },
    author : {
        type : String,
    },
    createdBy :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
},{timestamps : true});

const Blogs = model("blogs",blogSchema);

module.exports = Blogs;