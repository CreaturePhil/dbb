var fs = require('fs');
var uuid = require('uuid');

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

Methods.prototype.getSync = function(key) {
  var json = JSON.parse(fs.readFileSync(this.file, 'utf8'));
  if (json.hasOwnProperty(this.collection)) {
    return json[this.collection][key];
  }
};

Methods.prototype.getAll = function(callback) {
  var collection = this.collection;
  fs.readFile(this.file, 'utf8', function(err, data) {
    var json = JSON.parse(data);
    callback(err, json[collection]);
  });
};

Methods.prototype.getAllSync = function() {
  var json = JSON.parse(fs.readFileSync(this.file, 'utf8'));
  return json[this.collection];
};

Methods.prototype.insert = function(doc, callback) {
  var _this = this;
  fs.readFile(this.file, 'utf8', function(err, data) {
    var json = JSON.parse(data);
    if (!json.hasOwnProperty(_this.collection) || !Array.isArray(json[_this.collection])) {
      json[_this.collection] = [];
    }

    doc._id = uuid.v4();
    json[_this.collection].push(doc);
    fs.writeFile(_this.file, JSON.stringify(json), function(err) {
      if (typeof callback === 'function') {
        callback(err);
      }
    });
  });
};

Methods.prototype.insertSync = function(doc) {
  var json = JSON.parse(fs.readFileSync(this.file, 'utf8'));
  if (!json.hasOwnProperty(this.collection) || !Array.isArray(json[this.collection])) {
    json[this.collection][key] = [];
  }

  doc._id = uuid.v4();
  json[this.collection].push(doc);
  fs.writeFileSync(this.file, JSON.stringify(json));
};

Methods.prototype.remove = function(key, callback) {
  var _this = this;
  fs.readFile(this.file, 'utf8', function(err, data) {
    var json = JSON.parse(data);
    if (json.hasOwnProperty(_this.collection)) {
      delete json[_this.collection][key];
    }

    fs.writeFile(_this.file, JSON.stringify(json), function(err) {
      if (typeof callback === 'function') {
        callback(err);
      }
    });
  });
};

Methods.prototype.removeSync = function(key) {
  var json = JSON.parse(fs.readFileSync(this.file, 'utf8'));
  if (json.hasOwnProperty(this.collection)) {
    delete json[this.collection][key];
  }

  fs.writeFileSync(this.file, JSON.stringify(json));
};

Methods.prototype.set = function(key, value, callback) {
  var _this = this;
  fs.readFile(this.file, 'utf8', function(err, data) {
    var json = JSON.parse(data);
    if (json.hasOwnProperty(_this.collection) && !Array.isArray(json[_this.collection])) {
      json[_this.collection][key] = value;
    } else {
      json[_this.collection] = {};
      json[_this.collection][key] = value;
    }

    fs.writeFile(_this.file, JSON.stringify(json), function(err) {
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
