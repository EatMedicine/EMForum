var crypto = require('crypto')

var encrypt = function(password,salt) {
    const md5 = crypto.createHash('md5');
    return md5.update(password+salt).digest('hex');
};

function check(str,salt,encryptText){
    if(encrypt(str,salt) == encryptText){
        return true;
    }
    else{
        return false;
    }
}

module.exports = {
    encrypt,
    check
}