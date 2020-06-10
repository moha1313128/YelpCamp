const Post = require("../models/Post.js");
const Comment = require("../models/Comment");

middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You must log in");
  res.redirect("/login");
};

middlewareObj.checkPostownership = (req, res, next) => {
  // Check if user is logged in
  if (req.isAuthenticated()) {
    Post.findById(req.params.id, (err, foundPost) => {
      if (err) {
        req.flash("error", "Not Found");
        res.redirect("back");
      } else {
        // Check if user own the post
        if (foundPost.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You need permission to proced");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You must log in to proced");
    res.redirect("back");
  }
};

middlewareObj.checkCommentownership = (req, res, next) => {
  // Check if user is logged in
  if (req.isAuthenticated()) {
    Post.findById(req.params.id, (err, foundComment) => {
      req.flash("error", "Not Found");
      if (err) {
        res.redirect("back");
      } else {
        // Check if user own the post
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You need permission to proced");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You must log in to proced");
    res.redirect("back");
  }
};

module.exports = middlewareObj;
