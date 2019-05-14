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
var signList = [];

var findRad = function(signList,radNum){
    for(var count=0;count<signList.length;count++){
        if(signList[count].radNum == radNum){
            var tmp = signList[count];
            signList.splice(count,1);
            return tmp;
        }
    }
    return false;
}

var GetRandom = function(n){
    var rnd="";
    for(var i=0;i<n;i++)
        rnd+=Math.floor(Math.random()*10);
    return rnd;
}

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

//返回status代码 0为缺少参数 1为服务器连接失败 2为注册失败 3为注册成功
app.post('/signup',function(req,res){
    var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    var responseData = {
        status: false
    }
    if(!req.body.username||!req.body.password||!req.body.email||!reg.test(req.body.email)){
        responseData.status = 0;
        res.end(JSON.stringify(responseData))
    }
    var url = config.remoteServer+"api/signup";
    request.post(url,{
        form:{
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        }
    },function(err,response,body){
        if(err){
            console.log(err);
            responseData.status = 1;
            res.end(JSON.stringify(responseData));
            return;
        }
        if(body=="false"){
            responseData.status = 2;
            res.end(JSON.stringify(responseData));
            return;
        }
        //发送邮件 ***语言自定义警告***
        var tmp = GetRandom(6);
        signList[signList.length]={
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            radNum: tmp
        }
        sendMail.sendEmail(req.body.email,'EMForum账号激活','<h1>点击下面链接激活账号</h1><br/><a href="'+config.localhost+'activate/?radnum='+tmp+'">链接</a>');
        console.log(body);
        responseData.status = 3;
        res.end(JSON.stringify(responseData));
    })
});
app.get('/activate',function(req,res){
    if(!req.query.radnum){
        res.redirect('/');
        return;
    }
    var data = findRad(signList,parseInt(req.query.radnum));
    if(data == false){
        res.redirect('/');
        return;
    }
    //发送激活请求
    console.log("发送激活请求:"+data);
    //待写
    var url = config.remoteServer+"api/activateuser";
    request.post(url,{
        form:{
            username: data.username
        }
    },function(err,response,body){
        if(err){
            console.log(err);
            res.end(false);
            return;
        }
        if(body=="false"){
            var result=`<script>alert('激活失败，请联系管理员');window.location.href="/"</script>`;
            res.send(result);
            return;
        }
        var result=`<script>alert('激活成功');window.location.href="/"</script>`;
        res.send(result)
    })
});
app.post('/haveuser',function(req,res){
    if(!req.body.username){
        res.end(false);
    }
    var url = config.remoteServer+"api/haveuser";

    request.post(url,{
        form:{
            username: req.body.username
        }
    },function(err,response,body){
        responseData = {
            status: false
        }
        if(err){
            console.log(err);
            res.end(JSON.stringify(responseData));
            return;
        }
        if(body=="false"){
            res.end(JSON.stringify(responseData));
            return;
        }
        else{
            responseData.status = true;
            res.end(JSON.stringify(responseData));
            return;
        }
    })
});

var server = app.listen(23333,function(){
    console.log('Server running!');
});