const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const middleware = require("../middleware");

router.get("/", async (req, res) => {
  const posts = await Post.find(req.body);
  res.render("post", { posts: posts });
});

router.get("/create", middleware.isLoggedIn, (req, res) => {
  res.render("create");
});

router.post("/", middleware.isLoggedIn, async (req, res) => {
  try {
    var title = req.body.title;
    var content = req.body.content;
    var image = req.body.image;
    var author = {
      id: req.user._id,
      username: req.user.username,
    };
    const newPost = { title, content, image, author };
    await Post.create(newPost);
    req.flash("success", "Post successufully added");
    res.redirect("/posts");
  } catch (error) {
    console.log(newPost);
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).populate("comments");
  // console.log(post.comments);
  res.render("view", { post: post });
});

router.get("/:id/edit", middleware.checkPostownership, async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("edit", { post: post });
});

router.put("/:id", middleware.checkPostownership, (req, res) => {
  Post.findOneAndUpdate(req.params.id, req.body.post, function (
    err,
    updatedPost
  ) {
    if (err) {
      res.redirect("/posts/" + req.params.id);
    } else {
      req.flash("success", "Post successufully updated");
      res.redirect("/posts/" + req.params.id);
    }
  });
});

router.delete("/:id", middleware.checkPostownership, (req, res) => {
  Post.findOneAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect("/posts");
    } else {
      req.flash("success", "Post successufully deleted");
      res.redirect("/posts");
    }
  });
});

module.exports = router;
