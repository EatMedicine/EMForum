var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')


app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use('/forum',express.static('html'));
app.use('/data',express.static('data'));
app.use('/css',express.static('res/css'));
app.use('/script',express.static('res/script'));
app.use('/res',express.static('res/picture'));

app.get('/',function(req,res){
    res.redirect("/forum/index.html");
    res.end();
});

var server = app.listen(23333,function(){
    console.log('Server running!');
});