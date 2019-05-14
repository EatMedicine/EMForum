var nodemailer = require("nodemailer");
var fs = require("fs");

//可以重写这个方法，来返回一个包含邮件隐私信息的auth
var GetAuth = function(){
    var file = fs.readFileSync('mailAuth.json','utf-8')
    var result = JSON.parse(file);
    return result;
}

var GetMailInfo = function(to,title,html){
    var file = fs.readFileSync('mailConfig.json');
    var result = JSON.parse(file);
    return {
        from: result.MailName +"<"+result.MailAddress+">",
        to: to,
        subject: title,
        text: "hello",
        html: html
    }
}

var transport = nodemailer.createTransport({
    host: "smtp.qq.com",
    secureConnection: true,
    port: 465,
    auth: GetAuth()//此处返回一个Json
})

var sendEmail = function(to,title,html){
    transport.sendMail(GetMailInfo(to,title,html),function(err,response){
        if(err){
            console.log("Send mail fail :"+err);
        }
        else{
            console.log("Send mail success:"+response);
        }
    })
}

module.exports={
    sendEmail
}