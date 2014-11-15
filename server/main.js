console.log("running server");

var express = require("express");
var app = express();
var path = require('path');
var bodyParser = require('body-parser')

var pathToDist = "../dist";
var pathToPublic = "../public";

var comments = []

app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use('/bower_components', express.static(path.join(__dirname, '..', 'bower_components')));

app.post('/comments', function(req, res) {
    comments.push(req.body)
})

app.get('/comments', function(req, res) {
    res.send(comments)
})

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(1337);