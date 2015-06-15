var fs = require('fs');

function db(file) {
  this.file = file;

  fs.exists(file, function(exists) {
    if (exists) return;
    fs.writeFile(file, '{}');
  });

  return database.bind(this);
}

function database(collection) {
  return new Methods(this.file, collection);
}

function Methods(file, collection) {
  this.file = file;
  this.collection = collection || 'default';
}

Methods.prototype.get = function(key, callback) {
  var collection = this.collection;
  fs.readFile(this.file, 'utf8', function(err, data) {
    var json = JSON.parse(data);
    if (json.hasOwnProperty(collection)) {
      callback(err, json[collection][key]);
    } else {
      callback(err);
    }
  });
};

Methods.prototype.set = function(key, value, callback) {
  var self = this;
  fs.readFile(this.file, 'utf8', function(err, data) {
    var json = JSON.parse(data);  
    if (json.hasOwnProperty(self.collection)) {
      if (Array.isArray(json[self.collection])) {
        json[self.collection] = {};
      }
      json[self.collection][key] = value;
      fs.writeFile(self.file, json);
      if (typeof callback === 'function') callback(err);
    } else {
      json[self.collection] = {};
      json[self.collection][key] = value;
      if (typeof callback === 'function') callback(err);
    }
  });
};

module.exports = db;
