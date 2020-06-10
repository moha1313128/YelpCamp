const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");
const seedDB = require("./seed");

const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comment");
const authRoutes = require("./routes/auth");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/User");

// seedDB();
require("dotenv").config();

const app = express();

mongoose.connect(
  "mongodb://localhost:27017/reatapi",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => {
    console.log("MongoDB connected");
  }
);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(flash());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport.use(
//   new LocalStrategy(
//     { usernameField: "email", passwordField: "password" },
//     (username, password, authCheckDone) => {
//       User.findOne({ username }).then((user) => {
//         if (!user) {
//           return authCheckDone(null, false, { msg: "This user is not exists" });
//         }
//         if (user.password !== password) {
//           return authCheckDone(null, false, { msg: "Password not Match" });
//         }
//         return authCheckDone(null, user);
//       });
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user._id);
// });
// passport.deserializeUser((id, done) => {
//   done(null, { id });
// });

// app.get("/login", (req, res, next) => {
//   const errors = req.flash().error || [];
//   console.log(errors);
//   res.render("auth/login", { errors });
// });
// app.post(
//   "/login",
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   (req, res) => {
//     res.send(req.user.username);
//   }
// );
// app.post("/login", function (req, res, next) {
//   /* look at the 2nd parameter to the below call */
//   passport.authenticate("local", function (err, user, info) {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return res.send("login");
//     }
//     req.logIn(user, function (err) {
//       if (err) {
//         return next(err);
//       }
//       return res.send("posts" + user.username);
//     });
//   })(req, res, next);
// });

// const ensureAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect("login");
// };

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// const isLoggedIn = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   req.flash("error", "You must be signed in to do that!");
//   res.redirect("/login");
// };

app.get("/", (req, res) => {
  res.render("home");
});
app.use("/posts", postRoutes);
app.use("/posts/:id/comments", commentRoutes);
app.use(authRoutes);

app.use((req, res) => {
  res.status(404);
  res.render("404");
});
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500);
  res.render("500");
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log("The server running on http://localhost:3000");
});
