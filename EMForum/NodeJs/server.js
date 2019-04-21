var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var multer = require("multer");
var router = express.Router();
var upload = multer({dest: 'uploads'});
var fs = require('fs');
var path=require('path');
var sendMail = require('./mail');
var request = require('request');  

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/forum',express.static('html'));
app.use('/data',express.static('data'));
app.use('/css',express.static('res/css'));
app.use('/script',express.static('res/script'));
app.use('/res',express.static('res/picture'));
app.use('/uploads',express.static('uploads'))

var GetConfig = function(){
    return JSON.parse(fs.readFileSync("config.json"));
}
var config = GetConfig();

app.get('/',function(req,res){
    res.redirect('/forum/index.html');
    res.end();
});

app.get('/areainfo',function(req,response){
    var data;
    var url = config.remoteServer+"api/getallareainfo";
    request.get(url,function(err,res,body){
        if(err){
            console.log("error");
        }
        response.writeHead(200,{'Content-Type':'text/json;charset=utf-8'})
        response.end(body);
    });
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

app.post('/signup',function(req,res){
    var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    var response = {
        status: false
    }
    if(!req.body.username||!req.body.password||!req.body.email||!reg.test(req.body.email)){
        var response = {
            status: 0
        }
        res.end(JSON.stringify(response))
    }
    
    res.end()
})

var server = app.listen(23333,function(){
    console.log('Server running!');
});