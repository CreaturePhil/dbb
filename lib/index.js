var fs = require('fs');

function Chidori(jsonFile) {
  this.jsonFile = jsonFile;
  this.cache = {};
  
  if (fs.existsSync(this.jsonFile)) {
    this.cache = JSON.parse(fs.readFileSync(this.jsonFile, 'utf8'));
  } else {
    fs.writeFileSync(this.jsonFile, JSON.stringify(this.cache));
  }

  return Database.bind(this);
}

function Database(collection) {
  this.collection = collection || 'default';

  return new Methods(this);
}

function Methods(context) {
  this.jsonFile = context.jsonFile;
  this.cache = context.cache;
  this.collection = context.collection;
}

Methods.prototype.get = function(key) {
  if (this.cache[this.collection] && this.cache[this.collection].hasOwnProperty(key)) {
    return this.cache[this.collection][key];
  }

  this.cache = JSON.parse(fs.readFileSync(this.jsonFile, 'utf8'));
  if (!this.cache[this.collection]) this.cache[this.collection] = {};
  return this.cache[this.collection][key];
};

Methods.prototype.set = function(key, value) {
  this.cache = JSON.parse(fs.readFileSync(this.jsonFile, 'utf8'));
  if (!this.cache[this.collection]) this.cache[this.collection] = {};
  this.cache[this.collection][key] = value;
  fs.writeFileSync(this.jsonFile, JSON.stringify(this.cache));
  return this.cache[this.collection][key];
};

module.exports = Chidori;
