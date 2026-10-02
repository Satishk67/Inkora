const { default: mongoose } = require("mongoose");
const Blogs = require("../models/blog");
const { getUser } = require("../services/auth");
const User = require("../models/user");
const Comment = require("../models/comment");

async function getAllBlogs (req,res) {
    const onePageLimit = 15;
    const pageNumber = Math.max(1, Number(req.query.page) || 1);
    const category = req.query.category?.trim();
    const filter = category
        ? { category: new RegExp(`^${category.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`, "i") }
        : {};
    try{
        const [blogs,totalBlogs] = await Promise.all([ Blogs.find(filter)
                                .sort({ createdAt: -1 })
                                .populate("createdBy","profilePicture")
                                .skip((pageNumber-1)*onePageLimit)
                                .limit(onePageLimit), Blogs.countDocuments(filter)]);

        const totalPages = Math.max(1, Math.ceil(totalBlogs / onePageLimit));
        return res.json({blogs : blogs, isLast : pageNumber >= totalPages});
    }
    catch(e){
        return res.status(500).json({errorMsg : e.message});
    }
}

async function getOneBlog(req,res){
    const blogId = req.query.blogId || req.params.blogId;
    try{
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({
                msg: `Invalid blogId - ${blogId}`
            });
        }

        const blog = await Blogs.findOne({_id : blogId}).populate("createdBy","profilePicture");

        if(!blog){
            return res.status(404).json({msg : `No blog exists with blogId - ${blogId}`});
        }

        const comments = await Comment.find({blogId}).populate("createdBy","profilePicture userName")
        
        return res.json({ blog : blog, comments : comments});
    }
    catch(e) {
        return res.status(500).json({msg : e.message});
    }
}

async function createBlog(req,res){
    const {title,content,category} = req.body;
    const thumbnail = req.file ? `/uploads/${req.user.userName}/${req.file.filename}` : "/images/default_thumbnail.jpg";

    const token = req.cookies?.userToken;

    if(!token) return res.json({msg : 'User not found !!'});

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
        
        return res.status(201).json({blogId : blog._id});
    }
    catch(e){
        return res.status(500).json({msg : e.message});
    }
}

async function deleteOneBlog(req,res){
    const blogId = req.params.blogId || req.query.blogId;
    try{
        if (!req.user?._id) {
            return res.status(401).json({ msg: "Please sign in to delete a story." });
        }

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({
                msg: `Invalid blogId - ${blogId}`
            });
        }

        const blog = await Blogs.findById(blogId);
        if(!blog){
            return res.status(404).json({msg : `No blog exists with blogId - ${blogId}`});
        }

        const isOwner = blog.createdBy
            ? String(blog.createdBy) === String(req.user._id)
            : blog.author === req.user.userName;
        if (!isOwner) {
            return res.status(403).json({ msg: "You can only delete your own stories." });
        }

        await blog.deleteOne();
        
        return res.json({blogId : blog._id});
    }
    catch(e){
        return res.status(500).json({msg : e.message});
    }
}

async function getUserBlogs(req,res){
    const userName = req.query.userName || req.params.userName;
    const onePageLimit = 15;
    const pageNumber = Math.max(1, Number(req.query.page) || 1);

    try{
        const userExist = await User.exists({userName : userName});
        if(!userExist) {
            return res.json({ userExist : userExist });
        }

        const authorPic = await User.findOne({ userName : userName },{ profilePicture: 1, _id: 0 });
        
        const [blogs,totalUserBlogs] = await Promise.all([ Blogs.find({ author : userName })
                                .sort({ createdAt: -1 })
                                .populate("createdBy","profilePicture")
                                .skip((pageNumber-1)*onePageLimit)
                                .limit(onePageLimit), Blogs.countDocuments({ author : userName }) ]);

        const totalPages = Math.max(1, Math.ceil(totalUserBlogs / onePageLimit));
        return res.json({ blogs : blogs, authorPic : authorPic.profilePicture, userExist : userExist, isLast : pageNumber >= totalPages, totalUserBlogs});
    }
    catch(e){
        return res.status(500).json({msg : e.message});
    }
}

module.exports = {
    getOneBlog,
    createBlog,
    deleteOneBlog,
    getUserBlogs,
    getAllBlogs,
}