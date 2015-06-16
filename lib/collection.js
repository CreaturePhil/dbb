var find = require('lodash.find');
var fs = require('fs');
var uuid = require('uuid');

/**
 * Find a document.
 *
 * @param {*} document - Usually an object
 * @param {Function} callback(err, doc)
 */
exports.find = function(document, callback) {
  this.read(function(err, json) {
    var doc = find(json[this.field], document);
    if (!doc) return callback('Not found');
    callback(err, doc);
  }.bind(this));
};

/**
 * Find a document synchronously.
 *
 * @param {*} document - Usually an object
 * @returns {*}
 */
exports.findSync = function(document) {
  var json = this.readSync();
  var doc = find(json[this.field], document);
  return doc;
};

/**
 * Helper function to check if field exists and insert document
 * to field.
 *
 * @param {Object} json
 * @param {String} field
 * @param {*} document
 * @returns {Object} json
 */
function insertDocument(json, field, document) {
    if (!json.hasOwnProperty(field) || !Array.isArray(json[field])) {
      json[field] = [];
    }

    if (typeof document === 'object') document._id = uuid.v4();
    json[field].push(document);
    return json;
}

/**
 * Insert a document.
 *
 * @param {*} document - Usually an object
 */
exports.insert = function(document, callback) {
  this.read(function(err, json) {
    json = insertDocument(json, this.field, document);
    fs.writeFile(this.file, JSON.stringify(json), function(err) {
      if (typeof callback === 'function') {
        callback(err);
      }
    });
  }.bind(this));
};

/**
 * Insert a document synchronously.
 *
 * @param {*} document - Usually an object
 */
exports.insertSync = function(document) {
  var json = insertDocument(this.readSync(), this.field, document);
  fs.writeFileSync(this.file, JSON.stringify(json));
};

/**
 * Save a document.
 *
 * @param {*} document
 * @param {Function} callback(err)
 */
exports.save = function(document, callback) {
  this.read(function(err, json) {
    if (json.hasOwnProperty(this.field)) {
      var field = json[this.field];
      if (Array.isArray(field)) {
        var index = field.indexOf(find(field, {_id: document._id}));
        field.splice(index, 1);
        this.insert(document, function(err) {
          if (typeof callback === 'function') {
            callback(err);
          }
        });
      }
    }
  }.bind(this));
};

/**
 * Save a document synchronously.
 *
 * @param {*} document
 */
exports.saveSync = function(document) {
  var json = this.readSync();
  if (json.hasOwnProperty(this.field)) {
    var field = json[this.field];
    if (Array.isArray(field)) {
      var index = field.indexOf(find(field, {_id: document._id}));
      field.splice(field.indexOf(document), 1);
      this.insertSync(document);
    }
  }
};
