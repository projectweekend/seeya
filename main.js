var argv = require('minimist')(process.argv.slice(2));
var config = require('./app/config');
var ChannelMonitor = require('./app/slack').ChannelMonitor;


if (require.main === module) {
    main();
}


function main() {
    var configFilePath = argv.c;
    if (!configFilePath) {
        console.log('Config file path must be provided with the -c argument');
        process.exit(1);
    }

    var appConfig = config.fromFile(configFilePath);

    var bot = new ChannelMonitor(appConfig.token, appConfig.channels, appConfig.targetString);

    bot.on('error', function (err) {
        console.log('Bot error!');
        console.log(err);
        process.exit(5);
    });

    bot.on('ready', function () {
        console.log('Bot connected!');
    });

    bot.on('leftChannel', function (channel) {
        console.log('Left channel: ' + channel);
    });

    bot.run();
}
