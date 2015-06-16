var find = require('lodash.find');
var fs = require('fs');
var uuid = require('uuid');
var document = require('./document');

module.exports = dbb;

/**
 * Creates a new DBB's database.
 *
 * @param {String} file
 * @returns {Function}
 * @api public
 */
function dbb(file) {
  this.file = file;

  fs.exists(file, function(exists) {
    if (exists) return;
    fs.writeFile(file, '{}');
  });

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
};

/**
 * Get the whole field synchronously.
 *
 * @returns {Array|Object}
 * @api private
 */
function allSync() {
  var json = this.readSync();
  return json[this.field];
};

/**
 * Read the database and returns the JSON data in the callback.
 *
 * @param {Function} callback(err, json)
 * @api private
 */
Methods.prototype.read = function(callback) {
  fs.readFile(this.file, 'utf8', function(err, data) {
    var json = JSON.parse(data);
    console.log(json);
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
  return JSON.parse(data);
};

Methods.prototype.get = document.get;
Methods.prototype.getSync = document.getSync;

Methods.prototype.getAll = all;
Methods.prototype.getAllSync = allSync;
  
Methods.prototype.findAll = all;
Methods.prototype.findAllSync = allSync;

Methods.prototype.find = function(document, callback) {
  var _this = this;
  fs.readFile(this.file, 'utf8', function(err, data) {
    var json = JSON.parse(data);
    var doc = find(json[_this.field], document);
    if (!doc) return callback('Not found');
    callback(err, doc);
  });
};

Methods.prototype.insert = function(doc, callback) {
  var _this = this;
  fs.readFile(this.file, 'utf8', function(err, data) {
    var json = JSON.parse(data);
    if (!json.hasOwnProperty(_this.field) || !Array.isArray(json[_this.field])) {
      json[_this.field] = [];
    }

    doc._id = uuid.v4();
    json[_this.field].push(doc);
    fs.writeFile(_this.file, JSON.stringify(json), function(err) {
      if (typeof callback === 'function') {
        callback(err);
      }
    });
  });
};

Methods.prototype.insertSync = function(doc) {
  var json = JSON.parse(fs.readFileSync(this.file, 'utf8'));
  if (!json.hasOwnProperty(this.field) || !Array.isArray(json[this.field])) {
    json[this.field] = [];
  }

  doc._id = uuid.v4();
  json[this.field].push(doc);
  fs.writeFileSync(this.file, JSON.stringify(json));
};

Methods.prototype.remove = function(key, callback) {
  this.read(function(err, json) {
    if (json.hasOwnProperty(this.field)) {
      delete json[this.field][key];
    }

    fs.writeFile(this.file, JSON.stringify(json), function(err) {
      if (typeof callback === 'function') {
        callback(err);
      }
    });
  }.bind(this));
};

Methods.prototype.removeSync = function(key) {
  var json = this.readSync();
  if (json.hasOwnProperty(this.field)) {
    delete json[this.field][key];
  }

  fs.writeFileSync(this.file, JSON.stringify(json));
};

Methods.prototype.set = document.set;

Methods.prototype.setSync = document.setSync;
