/*
 低概率随机回复
*/


(function() {
  module.exports = function(content, send, robot, message) {
    if(random(0.01)) {
        var tuling123 = require('./tuling123');
        tuling123(content, send, robot, message);
    }
  };

}).call(this);

// for example => rate: 0.1
function random(rate) {
    var i = Math.random()*10000 | 0;
    return i < (10000 * rate | 0);
}