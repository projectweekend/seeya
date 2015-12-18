'use strict';
var EventEmitter = require('events');
var request = require('request');
var WebSocket = require('ws');
var logger = require('./logging').logger;


var exports = module.exports = {};


class ChannelMonitor extends EventEmitter {
    constructor(token, channels, targetString) {
        super();
        this.url = 'https://slack.com/api/rtm.start';
        this.token = token;
        this.channels = channels;
        this.targetString = targetString;

        this.socket = null;
        this.on('connected', this.setupSocket);
        this.on('mention', this.leaveChannel);
    }

    run() {
        var _this = this;
        var config = {
            url: _this.url,
            method: 'GET',
            qs: {
                token: _this.token
            }
        };
        request(config, function(err, response, body) {
            if (!err && response.statusCode == 200) {
                var data = JSON.parse(body);
                _this.socket = new WebSocket(data.url);
                return _this.emit('connected');
            }
            if (err) {
                return _this.emit('error', new Error('Unable to connect to Slack websocket'));
            }
            if (response.statusCode != 200) {
                return _this.emit('error', new Error('Call to Slack API did not return 200'));
            }
        });
    }

    setupSocket() {
        var _this = this;
        _this.socket.on('error', function () {
            return _this.emit('error', new Error('Slack websocket error occurred'));
        });
        _this.socket.on('message', function (data) {
            var message = JSON.parse(data);
            if (message.type === 'message') {
                var isChannel = _this.channels.indexOf(message.channel) > -1;
                if (isChannel) {
                    logger.info(message);
                    var isMention = message.text.indexOf(_this.targetString) > -1;
                    if (isMention) {
                        return _this.emit('mention', message.channel);
                    }
                }
            }
        });
        return _this.emit('ready');
    }

    leaveChannel(channel) {
        var _this = this;
        var config = {
            url: 'https://slack.com/api/channels.leave',
            method: 'GET',
            qs: {
                token: _this.token,
                channel: channel
            }
        };
        request(config, function(err, response, body) {
            if (!err && response.statusCode == 200) {
                return _this.emit('leftChannel', channel);
            }
            if (err) {
                return _this.emit('error', new Error('Error leaving Slack channel'));
            }
            if (response.statusCode != 200) {
                return _this.emit('error', new Error('Call to leave Slack channel did not return 200'));
            }
        });
    }
}


exports.ChannelMonitor = ChannelMonitor;
