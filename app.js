'use strict';

var conf = require('./lib/conf');
var Nest = require('./lib/nestClient');
var Influx = require('./lib/influx');
var SlackBot = require('slackbots');

// Create & Configure Slackbot
var bot = new SlackBot({
    token: conf.get('slackbot:api_token'),
    name: 'nest-status'
});
var channel = conf.get('slackbot:channel');
var params = {icon_emoji: ':nest:'};

bot.postMessageToGroup(channel, 'Nest Has Started', params);

function getData() {
    Nest.getNestData().then(function(nestData) {
        Influx.writeInflux(nestData);
        // Every 5 minutes send data.
        setTimeout(getData, 300000);

    }, function(error) {
        bot.postMessageToGroup(channel, 'Nest Error: ' + error, params);
        console.error('Failed!', error);
    });
};

getData();
