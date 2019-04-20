var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var multer = require("multer");
var router = express.Router();
var upload = multer({dest: 'uploads'});
var fs = require('fs');
var path=require('path');

app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use('/forum',express.static('html'));
app.use('/data',express.static('data'));
app.use('/css',express.static('res/css'));
app.use('/script',express.static('res/script'));
app.use('/res',express.static('res/picture'));
app.use('/uploads',express.static('uploads'))

app.get('/',function(req,res){
    res.redirect('/forum/index.html');
    res.end();
});

app.post('/uploadimg',upload.single('image'),function(req,res,next){
    var name = req.file.originalname.split(".");
    if(name.length<2){
        name = name[0];
    }
    else{
        var time = Date.now();
        name = time+"-"+name[0]+path.extname(req.file.originalname);
    }
    fs.rename(req.file.path,'uploads/'+name,function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("upload "+name+" success!");
        }
    });
    response ={
        filepath:'/uploads/'+name
    }
    res.end(JSON.stringify(response));
})

var server = app.listen(23333,function(){
    console.log('Server running!');
});