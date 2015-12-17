var argv = require('minimist')(process.argv.slice(2));
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'seeya'});
var config = require('./app/config');
var ChannelMonitor = require('./app/slack').ChannelMonitor;


if (require.main === module) {
    main();
}


function main() {
    var configFilePath = argv.c;
    if (!configFilePath) {
        log.info('Config file path must be provided with the -c argument');
        process.exit(1);
    }

    var appConfig = config.fromFile(configFilePath);

    var bot = new ChannelMonitor(appConfig.token, appConfig.channels, appConfig.targetString);

    bot.on('error', function (err) {
        log.info('Bot error!');
        log.info(err);
        process.exit(5);
    });

    bot.on('ready', function () {
        log.info('Bot connected!');
    });

    bot.on('leftChannel', function (channel) {
        log.info('Left channel: ' + channel);
    });

    bot.run();
}
