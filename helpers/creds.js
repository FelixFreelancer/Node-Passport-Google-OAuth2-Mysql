const crypto = require('crypto');

const method = "AES256";
const key = "SuperSecretPasswordForce2018120417";
const iv = "2018033019980324";
const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

exports.encryptpwd = function(password) {
    const cipher = crypto.createCipheriv(method, key, iv);
    let encryptedPwd = cipher.update(password, 'utf8', 'hex');
    encryptedPwd += cipher.final('hex');

    return encryptedPwd;
}

exports.decryptpwd = function(password) {
    const cipher = crypto.createDecipheriv(method, key, iv);
    let decryptedText = cipher.update(password, 'hex', 'utf8');
    decryptedText += cipher.final('utf8');

    return decryptedText;
}

exports.genToken = function() {
    let token = '';
    for (let i = 32; i > 0; --i) {
        token += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return token;
}

/*
exports.generateUUID = function(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}
*/