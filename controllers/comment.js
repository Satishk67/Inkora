const mongoose  = require("mongoose");
const Comment = require("../models/comment");

async function postComment(req,res) {
    const blogId = new mongoose.Types.ObjectId(req.params.blogId);

    if(!blogId){
        res.redirect("back");
    }

    if(!req.user){
        res.render("loginPage");
    }

    const { content } = req.body;

    const comment = Comment.create({
        content,
        createdBy : req.user._id,
        blogId,
    })

    res.redirect(`/blogs/${blogId}`);
}

module.exports = {
    postComment,
}