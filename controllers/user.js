const mongoose = require("mongoose");
const { createHmac } = require("crypto");
const User = require("../models/user");
const { setUser } = require("../services/auth");

async function createUser(req, res) {
  const { userName, fullName, gender, email, password } = req.body || {};

  if (!userName || !fullName || !gender || !email || !password) {
    return res.status(400).send("Missing signup fields");
  }

  try {
    if (
      userName === "" ||
      userName.length > 15 ||
      userName.length < 8 ||
      userName.includes(" ") ||
      !/\d/.test(userName)
    ) {
      return res.render("signupPage", { msg: "Invalid Username !!" });
    }

    if (
      password === "" ||
      password.length > 15 ||
      password.length < 8 ||
      password.includes(" ") ||
      !/\d/.test(password)
    ) {
      return res.render("signupPage", { msg: "Invalid Password !!" });
    }

    const existingUser = await User.findOne({ email });
    const existingUserName = await User.findOne({ userName });

    if (existingUser) {
      return res.render("signupPage", {
        msg: "User already exist! Please Login",
      });
    }
    if (existingUserName) {
      return res.render("signupPage", {
        msg: "Username already exist! Please try with other Username",
      });
    }

    const user = await User.create({
      userName,
      fullName,
      gender,
      email,
      password: password.trim(),
    });

    // Creat token for login
    const token = setUser(user);
    res.cookie("userToken",token)

    return res.render("/");
  } catch (error) {
    console.error("Signup failed:", error);
    return res.status(500).send(`Signup failed: ${error.message}`);
  }
}

async function checkuserName(req, res) {
  try {
    const { userName } = req.params;

    if (!userName) {
      return res.status(400).json({
        msg: "Username is required",
      });
    }

    const existinguser = await User.findOne({ userName });

    if (existinguser)
      res.json({
        msg: "Oops! Already Taken",
        color: "red",
      });

    return res.json({
      msg: "Kudos! Good to go",
      color: "green",
    });
  } catch (e) {
    return res.status(500).json({ msg: `Server error : ${e.message}` });
  }
}

async function loginHandler(req, res) {
  try {
    const { identifier, password } = req.body;
    const existingUser = await User.findOne({
      $or: [{ userName: identifier }, { email: identifier }],
    });

    const inputPassword = password.trim();

    if (!existingUser) {
      return res.render("loginPage", {
        msg: `${identifier} does not exist! Please sign up`,
      });
    }

    // creating hash of input password and ccomparing
    const hashedPassword = createHmac("sha256", existingUser.salt)
      .update(inputPassword)
      .digest("hex");

    if (hashedPassword !== existingUser.password) {
      return res.render("loginPage", { msg: "Invalid credentials!!" });
    }

    const token = setUser(existingUser);
    res.cookie("userToken",token);
    return res.redirect("/");

  } catch (e) {
    return res.status(500).json(`msg : server error ${e.message}`);
  }
}

function logoutHandler (req,res){
  return res.clearCookie("userToken").redirect("/");
}

module.exports = {
  createUser,
  checkuserName,
  loginHandler,
  logoutHandler
};
