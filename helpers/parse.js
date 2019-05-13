exports.base64ToJSON = function(str) {
    var json_str = Buffer.from(str, "base64").toString('utf-8');
    try {
        return JSON.parse(json_str);    
    } catch (error) {
        console.log(`Error in parse.base64ToJSON [${json_str}]`);
    }
    
}

exports.JSONToBase64 = function(json) {
    return Buffer.from(JSON.stringify(json)).toString('base64');
}
