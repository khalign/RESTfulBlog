var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/blog", {useNewUrlParser: true, useUnifiedTopology: true});
var blogSchema = new mongoose.Schema({title: String, image: String, body: String, created: {type: Date, default: Date.now}});
var Blog = mongoose.model("Blog", blogSchema);

app.get('/', function(req, res) {
    res.redirect('/blogs')
})

app.get('/blogs', function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) console.log(err)
        else res.render('index', {blogs})
    })
})

app.get('/blogs/form', function(req, res) {
    res.render('form')
})

app.post('/blogs', function(req, res) {
    Blog.create(req.body.blog, function(err, data) {
        if (err) res.render('form')
        else res.redirect('/blogs')
    })
})

app.listen(3000, function(error) {
    if (error) throw error;
    console.log("Server is running on port 3000");
});