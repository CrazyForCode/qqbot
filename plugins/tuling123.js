/*  
  turing123 bot
  http://www.tuling123.com
  
 */

var config = require('../config');
var request = require('request');
var Log = require('log');

(function() {
  var log = new Log('debug');
  module.exports = function(content, send, robot, message) {
    if (message.at == null && message.from_user.account != '1265622079') {
        return "nothing";
    }

    // log.debug(JSON.stringify(message));
    if (content.match(/^\s*$/)) {
      return send('找' + config.nickname + '有什么事呀 (^O^)／');
    } else {
      request({
        method: 'POST',
        uri: 'http://www.tuling123.com/openapi/api',
        form: {
          key: config.tuling_key,
          info: content,
          userid: message.from_user.account,
          loc: config.tuling_loc
        }
      }, function (error, response, body) {
        if (error) {
          console.log(error);
          send(config.nickname + '现在脑壳有点痛，等会儿再叫我 _(:зゝ∠)_');
        }
        if (response.statusCode == 200) {
          var data = JSON.parse(body);
          var reply = '@' + message.from_user.nick + '  ';
          switch (data.code) {
            case 100000:
              reply += data.text;
              break;
            case 200000:
              reply += config.nickname + '找到公交路线了哟\n' + data.url;
              break;
            default:
              reply += config.nickname + '现在一脸懵逼，等会儿再叫我 _(:зゝ∠)_';
          }
          send(reply);
        }
      });
    }
  };

}).call(this);


function parse_tuling_response(data) {
  
}