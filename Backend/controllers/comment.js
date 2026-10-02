const mongoose  = require("mongoose");
const Comment = require("../models/comment");

async function postComment(req,res) {
    try{

        const blogId = new mongoose.Types.ObjectId(req.params.blogId || req.query.blogId);

        if(!blogId){
            res.json({msg : "Blog not exist !!"});
        }

        if(!req.user){
            res.status(401).json({msg : "User not logged in !!"});
        }

        const { content } = req.body;

        const comment = await Comment.create({
            content,
            createdBy : req.user._id,
            blogId,
        })

        res.json({comment : comment});
    }
    catch(e){
        res.status(500).json({msg : `Server Error : ${e}`});
    }
}

module.exports = {
    postComment,
}