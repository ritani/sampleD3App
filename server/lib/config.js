var express = require('express');
var app = express();

var config = {};

app.configure(function(){
  var configFile = process.env.NODE_ENV === 'production' ? '../../config_prod.json' : '../../config.json';
  config = require(configFile);
});

module.exports = config;
