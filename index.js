var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

var app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());

mongoose.connect("mongodb://localhost:27017/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});
var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res) {
  res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
  Blog.find({}, function(err, blogs) {
    if (err) console.log(err);
    else res.render("index", { blogs });
  });
});

app.get("/blogs/form", function(req, res) {
  res.render("form");
});

app.post("/blogs", function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, data) {
    if (err) res.render("form");
    else res.redirect("/blogs");
  });
});

app.get("/blogs/:id", function(req, res) {
  Blog.findById(req.params.id, function(err, data) {
    if (err) console.log(err);
    else res.render("show", { blog: data });
  });
});

app.get("/blogs/:id/edit", function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findById(req.params.id, function(err, data) {
    if (err) console.log(err);
    else res.render("update", { blog: data });
  });
});

app.put("/blogs/:id", function(req, res) {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, data) {
    if (err) console.log(err);
    else res.redirect("/blogs/" + req.params.id);
  });
});

app.delete("/blogs/:id", function(req, res) {
  Blog.findByIdAndRemove(req.params.id, function(err, data) {
    if (err) res.redirect("/blogs/" + req.params.id);
    else res.redirect("/blogs");
  });
});

app.listen(3000, function(error) {
  if (error) throw error;
  console.log("Server is running on port 3000");
});
