
require("dotenv").config();

const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const path = require("path")

const userRoute = require("./routes/user")
const blogRoute = require("./routes/blog")
const commentRoute = require("./routes/comment")

const connectDB = require("./middlewares/connectMongo");
const { checkForAuthenticationCookie } = require("./middlewares/authenticateUser");

connectDB(process.env.MONGO_URL);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("userToken"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.static(path.resolve("./public")));


app.get("/api",checkForAuthenticationCookie("userToken"), (req, res) => {
    return res.json({ user: req.user });
})

app.use("/api/user",checkForAuthenticationCookie("userToken"),userRoute);
app.use("/api/blogs",checkForAuthenticationCookie("userToken"), blogRoute);
app.use("/api/comment",checkForAuthenticationCookie("userToken"), commentRoute);

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
