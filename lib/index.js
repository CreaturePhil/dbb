var fs = require('fs');
var path = require('path');

function PickleDB(file) {
  this.file = file;
  this.cacheObject = {};

  var self = this;
  fs.exists(this.file, function(exists) {
    if (!exists) {
      return fs.writeFile(self.file, '{}', function(err) {
        if (err) throw new Error(err);
      });
    }
    fs.readFile(self.file, 'utf8', function(err, data) {
      if (err) throw new Error(err);
      var object = JSON.parse(data);
      self.cacheObject = object;
    });
  });
}

PickleDB.prototype.get = function(key, callback) {
  if (this.cacheObject.hasOwnProperty(key) && typeof callback === 'function') {
    return callback(this.cacheObject[key]);
  }

  var self = this;
  fs.readFile(self.file, 'utf8', function(err, data) {
    if (err) throw new Error(err);
    var object = JSON.parse(data);
    self.cacheObject = object;
    if (typeof key === 'function') {
      return key(object);
    }
    if (typeof callback === 'function') {
      return callback(object[key]);
    }
  });
};

PickleDB.prototype.set = function(key, value, callback) {
  var self = this;
  fs.readFile(self.file, 'utf8', function(err, data) {
    if (err) throw new Error(err);
    if (!data) data = '{}';
    var object = JSON.parse(data);
    object[key] = value;
    self.cacheObject = object;
    fs.writeFile(self.file, JSON.stringify(object), function(err) {
      if (err) throw new Error(err);
      if (typeof callback === 'function') {
        callback();
      }
    });
  });
};

PickleDB.prototype.remove = function(key, callback) {
  var self = this;
  fs.readFile(self.file, 'utf8', function(err, data) {
    if (err) throw new Error(err);
    if (!data) data = '{}';
    var object = JSON.parse(data);
    delete object[key];
    self.cacheObject = object;
    fs.writeFile(self.file, JSON.stringify(object), function(err) {
      if (err) throw new Error(err);
      if (typeof callback === 'function') {
        callback();
      }
    });
  });
};

PickleDB.prototype.populate = function(newObject, callback) {
  var self = this;
  fs.readFile(self.file, 'utf8', function(err, data) {
    if (err) throw new Error(err);
    if (!data) data = '{}';
    var object = JSON.parse(data);
    for (var key in newObject) {
      object[key] = newObject[key];
    }
    self.cacheObject = object;
    fs.writeFile(self.file, JSON.stringify(object), function(err) {
      if (err) throw new Error(err);
      if (typeof callback === 'function') {
        callback();
      }
    });
  });
};

PickleDB.prototype.drop = function() {
  fs.unlink(this.file, function(err) {
    if (err) throw new Error(err); 
  });  
};

module.exports = PickleDB;
