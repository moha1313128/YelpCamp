const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

/*====================== JWT ======================*/

// const signToken = (id) => {
//   return jwt.sign({ id }, process.env.SECRET, {
//     expiresIn: process.env.EXPIRE_IN,
//   });
// };
// router.get("/register", (req, res) => {
//   res.render("auth/register");
// });

// router.post("/register", async (req, res) => {
//   const newUser = await User.create({
//     username: req.body.username,
//     email: req.body.email,
//     password: req.body.password,
//     passwordConfirm: req.body.passwordConfirm,
//   });

//   const token = signToken(newUser._id);
//   console.log(newUser);
//   console.log(token);
// });

// router.get("/login", (req, res) => {
//   res.render("auth/login");
// });

// router.post("/login", async (req, res, next) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return next("email & password not exists");
//   }
//   const user = await User.findOne({ email }).select("+password");

//   if (!user || !(await user.correctPassword(password, user.password))) {
//     return next("Incorrect password");
//   }

//   const token = signToken(user._id);
//   console.log(token);
// });

// router.get("/logout", (req, res) => {
//   res.redirect("/");
// });

/*====================== Passport ======================*/

//root route
// router.get("/", function(req, res){
//     res.render("landing");
// });

// show register form
router.get("/register", function (req, res) {
  res.render("register", { page: "register" });
});

//handle sign up logic
router.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username });
  // if(req.body.adminCode === process.env.ADMIN_CODE) {
  //   newUser.isAdmin = true;
  // }
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("register", { error: err.message });
    }
    passport.authenticate("local")(req, res, function () {
      req.flash(
        "success",
        "Successfully Signed Up! Nice to meet you " + req.body.username
      );
      res.redirect("/posts");
    });
  });
});

//show login form
router.get("/login", function (req, res) {
  res.render("login", { page: "login" });
});

//handling login logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Welcome to our app",
  }),
  function (req, res) {
    req.flash("success", "Welcome" + req.body.username);
  }
);

// logout route
router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "See you later!");
  res.redirect("/");
});

module.exports = router;
