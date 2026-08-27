const { Router } = require("express");
const { createUser, checkuserName, loginHandler, logoutHandler } = require("../controllers/user");

const router = new Router();

router.get("/signup",(req,res) => {
    res.render("signupPage");
});

router.post("/signup",createUser);


router.get("/login",(req,res) => {
    res.render("loginPage");
});

router.post("/login", loginHandler);

router.get("/checkuser/:userName",checkuserName)

router.get("/logout", logoutHandler);

module.exports = router