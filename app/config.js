var fs = require('fs');


var exports = module.exports = {};
exports.fromFile = fromFile;


function fromFile(path) {
    var config = JSON.parse(fs.readFileSync(path));
    if (!config.token) {
        console.log("Config file is missing 'token' property");
        process.exit(2);
    }

    if (!config.channels || config.channels.length === 0) {
        console.log("Config file 'channel' property is missing or empty");
        process.exit(3);
    }
    return config;
}
