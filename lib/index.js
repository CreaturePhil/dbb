var fs = require('fs');

/**
 * Create a Chidori Database.
 *
 * @param {String} jsonFile
 */
function Chidori(jsonFile) {
  this.jsonFile = jsonFile;
  this.object = {};
  
  if (fs.existsSync(this.jsonFile)) {
    this.object = JSON.parse(fs.readFileSync(this.jsonFile, 'utf8'));
  } else {
    fs.writeFileSync(this.jsonFile, JSON.stringify(this.object));
  }

  return Database.bind(this);
}

/**
 * Query for the collection and create methods for it.
 *
 * @param {String} collection
 */
function Database(collection) {
  this.collection = collection || 'default';

  return new Methods(this);
}

/**
 * Helper functions to query the database.
 *
 * @constructor
 * @param {String} context
 */
function Methods(context) {
  this.jsonFile = context.jsonFile;
  this.object = context.object;
  this.collection = context.collection;
}

/**
 * Get the whole collection.
 */
Methods.prototype.getAll = function() {
  if (this.object[this.collection]) {
    return this.object[this.collection];
  }
  this.object = JSON.parse(fs.readFileSync(this.jsonFile, 'utf8'));
  return this.object[this.collection];
};

/**
 * Get a key from the collection.
 * 
 * @param {String} key
 * @returns {*}
 */
Methods.prototype.get = function(key) {
  if (this.object[this.collection] && this.object[this.collection].hasOwnProperty(key)) {
    return this.object[this.collection][key];
  }

  this.object = JSON.parse(fs.readFileSync(this.jsonFile, 'utf8'));
  if (!this.object[this.collection]) this.object[this.collection] = {};
  return this.object[this.collection][key];
};

/**
 * Set a key to a value in the collection.
 *
 * @param {String} key
 * @param {*} value
 * @returns {*}
 */
Methods.prototype.set = function(key, value) {
  this.object = JSON.parse(fs.readFileSync(this.jsonFile, 'utf8'));
  if (!this.object[this.collection]) this.object[this.collection] = {};
  this.object[this.collection][key] = value;
  fs.writeFileSync(this.jsonFile, JSON.stringify(this.object));
  return this.object[this.collection][key];
};

/**
 * Remove a key in the collection.
 *
 * @param {String} key
 */
Methods.prototype.remove = function(key) {
  if (this.object[this.collection] && this.object[this.collection][key]) {
    delete this.object[this.collection][key];
    return;
  }
  this.object = JSON.parse(fs.readFileSync(this.jsonFile, 'utf8'));
  delete this.object[this.collection][key];
  fs.writeFileSync(this.jsonFile, JSON.stringify(this.object));
};

module.exports = Chidori;
