const mongoose = require("mongoose");
const Post = require("./models/Post");
const Comment = require("./models/Comment");
var data = [
  {
    title: "Chicken",
    content: "Chicken in the field",
    image:
      "https://images.unsplash.com/photo-1587976332106-fdcb966fb732?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
  },
  {
    title: "Woman",
    content: "Attractive girl in the yellow dress",
    image:
      "https://images.unsplash.com/photo-1580910532870-552653d9aa1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
  },
  {
    title: "Nature",
    content: "Nature",
    image:
      "https://images.unsplash.com/photo-1433940592492-216cd6e28a6d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
  },
];
function seedDB() {
  // Remove all Posts
  Post.remove({}, function (err) {
    if (err) {
      console.log(err);
    }
    console.log("posts removed");
    // Add Posts
    data.forEach(function (seed) {
      Post.create(seed, function (err, post) {
        if (err) {
          console.log(err);
        } else {
          console.log("Post Added");
          // Create Comment
          Comment.create(
            {
              text: "Nice image",
              author: "Mohammed",
            },
            {
              text:
                "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
              author: "Moha",
            },
            function (err, comment) {
              if (err) {
                console.log(err);
              } else {
                post.comments.push(comment);
                post.save();
                console.log("Comment Added");
              }
            }
          );
        }
      });
    });
  });
}

module.exports = seedDB;
