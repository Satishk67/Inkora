const mongoose = require("mongoose");
const { createHmac } = require("crypto");
const User = require("../models/user");
const { setUser } = require("../services/auth");


async function createUser(req, res) {
  const { userName, fullName, gender, email, password } = req.body || {};
  const profilePicture = req.file ? `/uploads/profilePictures/${req.file.filename}` : "/images/defaultProfilePic.svg";

  if (!userName || !fullName || !gender || !email || !password) {
    return res.status(400).json({msg : "Missing signup fields"});
  }

  try {
    if (
      userName === "" ||
      userName.length > 15 ||
      userName.length < 8 ||
      userName.includes(" ") ||
      !/\d/.test(userName)
    ) {
      return res.status(400).json({ msg: "Invalid Username !!" });
    }

    if (
      password === "" ||
      password.length > 15 ||
      password.length < 8 ||
      password.includes(" ") ||
      !/\d/.test(password)
    ) {
      return res.status(400).json({ msg: "Invalid Password !!" });
    }

    const existingUser = await User.findOne({ email });
    const existingUserName = await User.findOne({ userName });

    if (existingUser) {
      return res.status(409).json({
        msg: "User already exist! Please Login",
      });
    }
    if (existingUserName) {
      return res.status(409).json({
        msg: "Username already exist! Please try with other Username",
      });
    }

    const user = await User.create({
      userName,
      fullName,
      gender,
      profilePicture,
      email,
      password: password.trim(),
    });

    // Creat token for login
    const token = setUser(user);
    res.cookie("userToken",token)

    return res.json({ user });
  } 
  catch (error) {
    console.error("Signup failed:", error);
    return res.status(500).json({msg : `Signup failed: ${error.message}`});
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

    if (existinguser) {
      return res.json({
        msg: "Oops! Already Taken",
        color: "red",
      });
    }

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
    const user = await User.findOne({
      $or: [{ userName: identifier }, { email: identifier }],
    });

    const inputPassword = password.trim();

    if (!user) {
      return res.status(401).json({
        msg: `${identifier} does not exist! Please sign up`,
      });
    }

    // creating hash of input password and ccomparing
    const hashedPassword = createHmac("sha256", user.salt)
      .update(inputPassword)
      .digest("hex");

    if (hashedPassword !== user.password) {
      return res.status(401).json({ msg: "Invalid credentials!!" });
    }

    const token = setUser(user);
    res.cookie("userToken",token);
    return res.json({ user });
    
  } catch (e) {
    return res.status(500).json({msg : `server error ${e.message}`});
  }
}

function logoutHandler (req,res){
  return res.clearCookie("userToken").json({msg : "success"});
}

module.exports = {
  createUser,
  checkuserName,
  loginHandler,
  logoutHandler
};
