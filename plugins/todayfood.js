/*
 今天吃什么 

*/
var sqlite3 = require('sqlite3').verbose();

(function() {
  module.exports = function(content, send, robot, message) {
    var db = new sqlite3.Database('./database/todayfood.db');
    var user;
    switch (message.type) {
      case 'group_message':
        user = message.from_group.account;
        break;
      case 'message':
        user = message.from_user.account;
      default:
        user = message.from_user.account;
    }
    console.log('#### message: ' + JSON.stringify(message));
    var at = (message.type == 'group_message') ? ('@' + message.from_user.nick + '  ') : '';

    db.serialize(function() {
      db.run("CREATE TABLE IF NOT EXISTS `foodlist` (\
            	`name`	TEXT NOT NULL UNIQUE,\
              `user_id`	TEXT NOT NULL\
              );");
      
      var result;
      if (result = content.match(/\s*help$/)) {
        send("今天吃点什么呢？\n- add <name>\n- remove <name>\n- remove all\n- list [count]\n- roll [count]");
      } else if (result = content.match(/\s*list\s*(\d*)$/)) {
        // list
        if (result[1] == '0') {
          send(at + '你是智障么为什么要填零');
          return;
        }
        var query = 'SELECT name FROM foodlist WHERE user_id = "' + user + '"'
        + (result[1] != '' ? ' LIMIT 0,' + result[1] : '');

        db.all(query, function(err, rows) {
          if (err) {
            console.log(err);
          }
          if (rows.length == 0) {
            send('没有找到菜单');
          }
          var reply = rows.map(function(item) {
            return item.name;
          }).reduce(function(content, next) {
            return content + '\n- ' + next;
          }, '菜单：');
          send(reply);
          return;
        });
      } else if (result = content.match(/\s*add\s*([\u4e00-\u9fa5_a-zA-Z0-9]+)\s*/)) {
        // add
        console.log('## result: ' + result[1]);
        
        db.run('INSERT INTO foodlist (name, user_id) VALUES ("' + result[1] + '", "' + user + '")');
        send('添加成功');
        return;
      } else if (result = content.match(/\s*remove\s*all\s*$/)) {
        // remove all 
        var section = 
        db.run('DELETE FROM foodlist WHERE user_id = "' + user + '"');
        send('删除所有成功');
        return;
      } else if (result = content.match(/\s*remove\s*([\u4e00-\u9fa5_a-zA-Z0-9]+)\s*/)) {
        // remove
        console.log('## result: ' + result[1]);
        db.run('DELETE FROM foodlist WHERE name = "' + result[1] + '" AND user_id = "' + user +  '"');
        send('删除成功');
        return;
      } else if (result = content.match(/\s*roll\s*(\d*)$/)) {
        // roll
        if (result[1] == '0') {
          send(at + '你是智障么为什么要填零');
          return;
        }
        var query = 'SELECT name FROM foodlist WHERE user_id = "' + user  + '" ORDER BY random() LIMIT '
        + (result[1] != '' ? result[1] : '1');
        db.all(query, function(err, rows) {
          if (err) {
            console.log(err);
          }
          if (rows.length == 0) {
            send('没有找到菜单');
          }
          var reply = rows.map(function(item) {
            return item.name;
          }).reduce(function(content, next) {
            return content + '\n- ' + next;
          }, '随机菜单：');
          send(reply);
          return;
        });
      }
    });
      
    db.close();
  };

}).call(this);
