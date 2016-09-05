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

    Nest.getNestData().then(Influx.writeInflux).then(function() {
        setTimeout(getData, conf.get('update_frequency'));
    }).catch(function(e) {
        bot.postMessageToGroup(channel,  e.message);
        // Retry
        setTimeout(getData, conf.get('update_frequency'));
    });

};

getData();
