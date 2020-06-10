const express = require("express");
const router = express.Router({ mergeParams: true });

const Post = require("../models/Post");
const Comment = require("../models/Comment");
const middleware = require("../middleware");

router.get("/new", (req, res) => {
  Post.findById(req.params.id, (err, post) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comment/new", { post: post });
    }
  });
});
//Comments Create
router.post("/", middleware.isLoggedIn, function (req, res) {
  //lookup post using ID
  Post.findById(req.params.id, function (err, post) {
    if (err) {
      console.log(err);
      res.redirect("/posts");
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          //add username and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          post.comments.push(comment);
          post.save();
          // console.log(comment);
          req.flash("success", "Comment successufully added");
          res.redirect("/posts/" + post._id);
        }
      });
    }
  });
});

router.get(
  "/:comment_id/edit",
  middleware.checkCommentownership,
  (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect("back");
      } else {
        res.render("comment/edit", {
          post_id: req.params.id,
          comment: foundComment,
        });
      }
    });
  }
);

router.put("/:comment_id/", middleware.checkCommentownership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        res.redirect("back");
      } else {
        req.flash("success", "Comment successufully updated");
        res.redirect("/posts/" + req.params.id);
      }
    }
  );
});

router.delete("/:comment_id", middleware.checkCommentownership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment successufully deleted");
      res.redirect("/posts/" + req.params.id);
    }
  });
});

module.exports = router;
