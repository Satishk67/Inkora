const {Router} = require("express");
const { postComment } = require("../controllers/comment");

const router = new Router;

router.post("/:blogId",postComment);
// router.delete("/",deleteComment);

module.exports = router;