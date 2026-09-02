
const { Router } = require("express");
const mongoose = require("mongoose");
const Blogs = require("../models/blog");
const User = require("../models/user");
const { createBlog, getOneBlog, deleteOneBlog, getUserBlogs, getAllBlogs, renderBlogForm } = require("../controllers/blog");

const multer = require("multer");
const fs = require("fs")
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderPath = path.resolve(__dirname, `../public/uploads/${req.user.userName}`);
        fs.mkdirSync(folderPath, { recursive: true });
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
        cb(null, safeName);
    }
});

const upload = multer({ storage });

const router = new Router();

router.get("/create", renderBlogForm);
router.get("/add", renderBlogForm);

router.get("/view/:blogId", getOneBlog);
router.get("/user/:userName", getUserBlogs);
router.get("/user", getUserBlogs);


router.get("/", (req, res) => {
  if (req.query.blogId) return getOneBlog(req, res);
  if (req.query.userName) return getUserBlogs(req, res);
  return getAllBlogs(req, res);
});

router.get("/:identifier", (req, res) => {
  const { identifier } = req.params;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    req.params.blogId = identifier;
    return getOneBlog(req, res);
  } else {
    req.params.userName = identifier;
    return getUserBlogs(req, res);
  }
});

router.delete("/:blogId", deleteOneBlog);

router.post("/create",upload.single("thumbnail"), createBlog);
router.post("/add",upload.single("thumbnail"),createBlog);

module.exports = router;