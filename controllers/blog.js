const { default: mongoose } = require("mongoose");
const Blogs = require("../models/blog");
const { getUser } = require("../services/auth");
const User = require("../models/user");
const Comment = require("../models/comment");

async function getAllBlogs (req,res) {
    try{
        const blogs = await Blogs.find({}).sort({ createdAt: -1 }).populate("createdBy","profilePicture");
        return res.render("blogPage",{ blogs : blogs, user: req.user });
    }
    catch(e){
        return res.status(500).render("serverError",{msg : e.message});
    }
}

async function getOneBlog(req,res){
    const blogId = req.query.blogId || req.params.blogId;
    try{
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.render("serverError",{
                msg: `Invalid blogId - ${blogId}`
            });
        }

        const blog = await Blogs.findOne({_id : blogId}).populate("createdBy","profilePicture");

        if(!blog){
            return res.render("serverError",{msg : `No blog exists with blogId - ${blogId}`});
        }

        const comments = await Comment.find({blogId}).populate("createdBy","profilePicture userName")
        
        return res.render("viewBlog",{ blog : blog, comments, user: req.user });
    }
    catch(e) {
        return res.status(500).render("serverError",{msg : e.message});
    }
}

async function renderBlogForm(req, res) {
    return res.render("blogForm", { user: req.user });
}

async function createBlog(req,res){
    const {title,content,category} = req.body;
    const thumbnail = req.file ? `/uploads/${req.user.userName}/${req.file.filename}` : "/images/default_thumbnail.jpg";

    const token = req.cookies?.userToken;

    if(!token) return res.render('loginPage');

    const user = getUser(token);

    try{
        const blog = await Blogs.create({
            title,
            content,
            category,
            thumbnail,
            author : user.userName,
            createdBy : user._id,
        })
        
        console.log(blog.thumbnail);
        return res.redirect(`/blogs/user/${user.userName}`);
    }
    catch(e){
        return res.status(500).render("serverError",{msg : e.message});
    }
}

async function deleteOneBlog(req,res){
    const blogId = req.params.blogId || req.query.blogId;
    try{

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.render("serverError",{
                msg: `Invalid blogId - ${blogId}`
            });
        }

        const blog = await Blogs.findOneAndDelete({_id : blogId});
        if(!blog){
            return res.render("serverError",{msg : `No blog exists with blogId - ${blogId}`});
        }
        
        return res.redirect(req.get("referer"));
    }
    catch(e){
        return res.status(500).render("serverError",{msg : e.message});
    }
}

async function getUserBlogs(req,res){
    const userName = req.query.userName || req.params.userName;
    try{
        const userExist = await User.exists({userName : userName});
        if(!userExist) {
            return res.render("userDashboard", { status : "false", user: req.user });
        }


        const authorPic = await User.findOne({ userName : userName },{ profilePicture: 1, _id: 0 });
        
        const blogs = await Blogs.find({ author : userName }).sort({ createdAt: -1 }).populate("createdBy","profilePicture");
        return res.render("userDashboard",{ status : "true", blogs : blogs, author: userName, user: req.user, authorPic : authorPic.profilePicture });
    }
    catch(e){
        return res.status(500).render("serverError",{msg : e.message});
    }
}

module.exports = {
    renderBlogForm,
    getOneBlog,
    createBlog,
    deleteOneBlog,
    getUserBlogs,
    getAllBlogs,
}