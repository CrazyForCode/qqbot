/*
https://crazyforcode.org

cfc qq bot

*/
var hitokoto = require('./hitokoto');
var tuling123 = require('./tuling123');
var todayfood = require('./todayfood');
var randomreply = require('./randomreply');

var config = require('../config');
var Log = require('log');

(function() {
  module.exports = function(content, send, robot, message) {
    // debug
    var log = new Log('debug');
    log.debug('=> content: ' + content);
    log.debug('=> message: ' + JSON.stringify(message));

    // hitokoto
    if (content.match(/^hitokoto/)) {
      hitokoto(content, send, robot, message);
      log.debug('~~> hitokoto');
    }
    // today food
    if (message.type == 'group_message' || message.type == 'message') {
      content = content.toLowerCase();
      if (content.match(/^food/)) {
        log.debug('~~> food');
        todayfood(content, send, robot, message);
        return;
      } else if (content.match(/^(今天)?吃(什么|啥)/)) {
        content = 'food roll';
        todayfood(content, send, robot, message);
        return;
      }
    }
    
    // tuling123
    if (message.type == 'group_message') {
      if (message.at != config.at) {
        return "nothing";
      }
      tuling123(content, send, robot, message);
    } else if (message.type == 'discu_message') {
      return "nothing";
      // if (message.at != config.at) {
      //   return "nothing";
      // }
      tuling123(content, send, robot, message);
    } else if (message.type == 'message') {
      if (message.from_user.account != '1265622079') {
        return "nothing";
      }
      tuling123(content, send, robot, message);
    }

    randomreply(content, send, robot, message);
  }
}).call(this);
