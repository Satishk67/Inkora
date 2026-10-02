const { Router } = require("express");
const { createUser, checkuserName, loginHandler, logoutHandler } = require("../controllers/user");
const multer = require("multer");
const fs = require("fs")
const path = require("path")

const router = new Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const folderPath = path.resolve(__dirname, "../public/uploads/profilePictures");
        fs.mkdirSync(folderPath, { recursive: true });
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
        cb(null, safeName);
    }
});

const upload = multer({ storage });

router.get("/signup",(req,res) => {
    res.render("signupPage");
});

router.post("/signup",upload.single("profilePicture"),createUser);

router.get("/login",(req,res) => {
    res.render("loginPage");
});

router.post("/login", loginHandler);

router.get("/checkuser/:userName",checkuserName)

router.get("/logout", logoutHandler);
router.post("/logout", logoutHandler);

module.exports = router