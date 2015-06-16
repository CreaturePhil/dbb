var fs = require('fs');

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
 * Helper function that checks if field exists and sets a key to
 * a value in the field.
 *
 * @param {Object} json
 * @param {String} field
 * @param {String} key
 * @param {*} value
 * @returns {Object} json
 */
function setField(json, field, key, value) {
  if (json.hasOwnProperty(field) && !Array.isArray(json[field])) {
    json[field][key] = value;
  } else {
    json[field] = {};
    json[field][key] = value;
  }

  return json;
}

/**
 * Set a key to a value.
 *
 * @param {String} key
 * @param {*} value
 * @param {Function} callback(err)
 */
exports.set = function(key, value, callback) {
  this.read(function(err, json) {
    json = setField(json, this.field, key, value);

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
  var json = setField(this.readSync(), this.field, key, value);

  fs.writeFileSync(this.file, JSON.stringify(json));
};
