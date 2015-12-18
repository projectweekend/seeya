var bunyan = require('bunyan');


var exports = module.exports = {};


exports.logger = bunyan.createLogger({
    name: 'seeya',
    streams: [
        {
            level: 'debug',
            path: '/var/tmp/seeya_logs.json'
        }
    ]
});
