
require("dotenv").config();

const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const path = require("path")
const userRoute = require("./routes/user")
const connectDB = require("./middlewares/connectMongo");
const { checkForAuthenticationCookie } = require("./middlewares/authenticateUser");

connectDB(process.env.MONGO_URL);

app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("userToken"));

app.set("view engine", "ejs");
app.set("views",path.resolve("./views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoute);

app.get("/", (req,res) => {
    return res.render("home",{user : req.user});
})

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
