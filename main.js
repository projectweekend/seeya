var argv = require('minimist')(process.argv.slice(2));
var config = require('./app/config');
var logger = require('./app/logging').logger;
var ChannelMonitor = require('./app/slack').ChannelMonitor;


if (require.main === module) {
    main();
}


function main() {
    var configFilePath = argv.c;
    if (!configFilePath) {
        logger.info('Config file path must be provided with the -c argument');
        process.exit(1);
    }

    var appConfig = config.fromFile(configFilePath);

    var bot = new ChannelMonitor(appConfig.token, appConfig.channels, appConfig.targetString);

    bot.on('error', function (err) {
        logger.info('Bot error!');
        logger.info(err);
        process.exit(5);
    });

    bot.on('ready', function () {
        logger.info('Bot connected!');
    });

    bot.on('leftChannel', function (channel) {
        logger.info('Left channel: ' + channel);
    });

    bot.run();
}
