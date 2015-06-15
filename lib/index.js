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
  this.collection = collection || 'default'; }

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

Methods.prototype.getSync = function(key) {
  var json = JSON.parse(fs.readFileSync(this.file, 'utf8'));
  if (json.hasOwnProperty(this.collection)) {
    return json[this.collection][key];
  }
};

Methods.prototype.set = function(key, value, callback) {
  var self = this;
  fs.readFile(this.file, 'utf8', function(err, data) {
    var json = JSON.parse(data);  
    if (json.hasOwnProperty(self.collection) && !Array.isArray(json[self.collection])) {
      json[self.collection][key] = value;
    } else {
      json[self.collection] = {};
      json[self.collection][key] = value;
    }
    fs.writeFile(self.file, JSON.stringify(json), function(err) {
      if (typeof callback === 'function') {
        callback(err);
      }
    });
  });
};

Methods.prototype.setSync = function(key, value) {
  var json = JSON.parse(fs.readFileSync(this.file, 'utf8'));
  if (json.hasOwnProperty(this.collection) && !Array.isArray(json[this.collection])) {
    json[this.collection][key] = value;
  } else {
    json[this.collection] = {};
    json[this.collection][key] = value;
  }
  fs.writeFileSync(this.file, JSON.stringify(json)); 
};

module.exports = db;
