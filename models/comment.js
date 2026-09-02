const {Schema, mongoose, model} = require("mongoose");

const commentSchema = new Schema({
    content : {
        type : String,
        required : true,
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    blogId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Blogs"
    }
},{timestamps : true})

const Comment = model("comment",commentSchema);

module.exports = Comment;
