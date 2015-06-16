var fs = require('fs');
var uuid = require('uuid');

/**
 * Get a key and returns a callback with value being any type of
 * of the key.
 *
 * @param {String} key
 * @param {Function} callback(err, value)
 */
exports.get = function(key, callback) {
  this.read(function(err, json) {
    if (json.hasOwnProperty(this.field)) {
      callback(err, json[this.field][key]);
    } else {
      callback(err);
    }
  }.bind(this));
};

/**
 * Get a key synchronously.
 *
 * @param {String} key
 * @returns {*}
 */
exports.getSync = function(key) {
  var json = this.readSync();
  if (json.hasOwnProperty(this.field)) {
    return json[this.field][key];
  }
};

/**
 * Set a key to a value.
 *
 * @param {String} key
 * @param {*} value
 * @param {Function} callback(err)
 */
exports.set = function(key, value, callback) {
  this.read(function(err, json) {
    if (json.hasOwnProperty(this.field) && !Array.isArray(json[this.field])) {
      json[this.field][key] = value;
    } else {
      json[this.field] = {};
      json[this.field][key] = value;
    }

    fs.writeFile(this.file, JSON.stringify(json), function(err) {
      if (typeof callback === 'function') {
        callback(err);
      }
    });
  }.bind(this));
};

/**
 * Set a key to a value synchronously.
 *
 * @param {String} key
 * @param {*} value
 */
exports.setSync = function(key, value) {
  var json = this.readSync();
  if (json.hasOwnProperty(this.field) && !Array.isArray(json[this.field])) {
    json[this.field][key] = value;
  } else {
    json[this.field] = {};
    json[this.field][key] = value;
  }

  fs.writeFileSync(this.file, JSON.stringify(json));
};
