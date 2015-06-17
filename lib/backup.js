var fs = require('fs');
var http = require('http');
var hour = 1000 * 60 * 60;

module.exports = addBackup;
function addBackup(file, time, test) {
  if (test) {
    Backup.call(null, file);
  } else {
    setInterval(Backup.bind(null, file), time * hour);
  }
}

var options = {
  host: 'www.hastebin.com',
  path: '/documents',
  method: 'POST'
};

function Backup(file) {
  fs.readFile(file, 'utf8', function(err, data) {
    if (err) throw new Error(err);
    var req = http.request(options, function(response) {
      var str = '';

      response.on('data', function(chunk) {
        str += chunk;
      });

      response.on('end', function() {
        var path = JSON.parse(str).key;
        var url = 'http://hastebin.com/' + path + '.hs';
        fs.readFile(file, 'utf8', function(err, data) {
          if (err) throw new Error(err);
          var json = JSON.parse(data);
          if (!json.hasOwnProperty('DBB_BACKUPS')) {
            json.DBB_BACKUPS = [url];
          } else {
            json.DBB_BACKUPS.push(url);
          }

          fs.writeFile(file, JSON.stringify(json), function(err) {
            if (err) throw new Error(err);
          });
        });
      });
    });

    req.write(data);
    req.end();
  });
}
