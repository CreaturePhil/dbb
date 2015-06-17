var fs = require('fs');
var addBackup = require('./backup');
var collection = require('./collection');
var document = require('./document');

module.exports = dbb;

/**
 * Creates a new DBB's database.
 *
 * @param {String} file
 * @param {Object} options
 * @returns {Function}
 * @api public
 */
function dbb(file, options) {
  this.file = file;

  fs.exists(file, function(exists) {
    if (exists) return;
    fs.writeFile(file, '{}');
  });

  if (typeof options === 'object' && options.backup) {
    if (typeof options.backup !== 'number') options.backup = 1;
    addBackup(this.file, options.backup, options.test);
  }

  return database.bind(this);
}

/**
 * Queries for the field.
 *
 * @param {String} field
 * @returns {Object}
 * @api public
 */
function database(field) {
  return new Methods(this.file, field);
}

/**
 * Methods to query the database.
 *
 * @constructor
 * @param {String} file
 * @api public
 */
function Methods(file, field) {
  this.file = file;
  this.field = field || 'default';
}

/**
 * Get the whole field.
 *
 * @param {Function} callback(err, field)
 * @api private
 */
function all(callback) {
  this.read(function(err, json) {
    callback(err, json[this.field]);
  }.bind(this));
}

/**
 * Get the whole field synchronously.
 *
 * @returns {Array|Object}
 * @api private
 */
function allSync() {
  var json = this.readSync();
  return json[this.field];
}

/**
 * Read the database and returns the JSON data in the callback.
 *
 * @param {Function} callback(err, json)
 * @api private
 */
Methods.prototype.read = function(callback) {
  fs.readFile(this.file, 'utf8', function(err, data) {
    if (!data) data = '{}';
    var json = JSON.parse(data);
    callback(err, json);
  });
};

/**
 * Read the database synchronously.
 *
 * @returns {Object} json
 * @api private
 */
Methods.prototype.readSync = function() {
  var data = fs.readFileSync(this.file, 'utf8');
  if (!data) data = '{}';
  return JSON.parse(data);
};

Methods.prototype.get = document.get;
Methods.prototype.getSync = document.getSync;

Methods.prototype.getAll = all;
Methods.prototype.getAllSync = allSync;

Methods.prototype.findAll = all;
Methods.prototype.findAllSync = allSync;

Methods.prototype.find = collection.find;
Methods.prototype.findSync = collection.findSync;

Methods.prototype.insert = collection.insert;
Methods.prototype.insertSync = collection.insertSync;

Methods.prototype.remove = remove;
Methods.prototype.removeSync = removeSync;

Methods.prototype.save = collection.save;
Methods.prototype.saveSync = collection.saveSync;

Methods.prototype.set = document.set;
Methods.prototype.setSync = document.setSync;

/**
 * Remove a key or document.
 *
 * @param {*} key
 * @param {Function} callback(err)
 */
function remove(key, callback) {
  this.read(function(err, json) {
    if (json.hasOwnProperty(this.field)) {
      var field = json[this.field];
      if (Array.isArray(field)) {
        field.splice(field.indexOf(key), 1);
      } else {
        delete field[key];
      }
    }

    fs.writeFile(this.file, JSON.stringify(json), function(err) {
      if (typeof callback === 'function') {
        callback(err);
      }
    });
  }.bind(this));
}

/**
 * Remove a key or document synchronously.
 *
 * @param {*} key
 * @param {Function} callback(err)
 */
function removeSync(key) {
  var json = this.readSync();
  if (json.hasOwnProperty(this.field)) {
    var field = json[this.field];
    if (Array.isArray(field)) {
      field.splice(field.indexOf(key), 1);
    } else {
      delete field[key];
    }
  }

  fs.writeFileSync(this.file, JSON.stringify(json));
}
