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

var types = {
  array: {
    push: function(object, key, value) {
      object[key].push(value);
    },
    pop: function(object, key, value) {
      object[key].pop(value);
    },
    remove: function(object, key, value) {
      object[key].splice(object[key].indexOf(key), 1);
    },
    removeIndex: function(object, key, value) {
      object[key].splice(key, 1);
    },
    shift: function(object, key, value) {
      object[key].shift();
    }
  },

  number: {
    add: function(object, key, value) {
      object[key] += value;
    },
    minus: function(object, key, value) {
      object[key] -= value;
    }
  }
};

var getType = function(elem) {
  return Object.prototype.toString.call(elem).slice(8, -1).toLowerCase();
};

PickleDB.prototype.update = function(query, value, callback) {
  if (query.indexOf(':') < 0) throw new Error('Must have colons (:) in update function.');
  var parts = query.split(':');
  var modiferName = parts.pop().toLowerCase();
  var key = parts.join(':');
  var self = this;
  fs.readFile(self.file, 'utf8', function(err, data) {
    if (err) throw new Error(err);
    if (!data) data = '{}';
    var object = JSON.parse(data);
    var type = getType(object[key]);
    var modifer = types[type];

    if (object.hasOwnProperty(key) && modifer) {
      modifer[modiferName](object, key, value);     
    } else if (!object.hasOwnProperty(key) && modiferName === 'push') {
      object[key] = [value];
    } else {
      object[key] = value;
    }

    self.cacheObject = object;
    fs.writeFile(self.file, JSON.stringify(object), function(err) {
      if (err) throw new Error(err);
      self.get(key, function(value) {
        if (typeof callback === 'function') {
          callback(value);
        }
      });
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
