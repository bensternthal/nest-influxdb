'use strict';

var conf = require('./lib/conf');
var Nest = require('./lib/nestClient');
var Influx = require('./lib/influx');

function getData() {
    Nest.getNestData().then(function(nestData) {
        Influx.writeInflux(nestData);
        // Every 5 minutes send data.
        setTimeout(getData, 300000);

    }, function(error) {
        console.error('Failed!', error);
    });
};


getData();
