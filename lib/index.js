var fs = require('fs');

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

function Database(collection) {
  this.collection = collection || 'default';

  return new Methods(this);
}

function Methods(context) {
  this.jsonFile = context.jsonFile;
  this.object = context.object;
  this.collection = context.collection;
}

Methods.prototype.getAll = function() {
  if (this.object[this.collection]) {
    return this.object[this.collection];
  }
  this.object = JSON.parse(fs.readFileSync(this.jsonFile, 'utf8'));
  return this.object[this.collection];
};

Methods.prototype.get = function(key) {
  if (this.object[this.collection] && this.object[this.collection].hasOwnProperty(key)) {
    return this.object[this.collection][key];
  }

  this.object = JSON.parse(fs.readFileSync(this.jsonFile, 'utf8'));
  if (!this.object[this.collection]) this.object[this.collection] = {};
  return this.object[this.collection][key];
};

Methods.prototype.set = function(key, value) {
  this.object = JSON.parse(fs.readFileSync(this.jsonFile, 'utf8'));
  if (!this.object[this.collection]) this.object[this.collection] = {};
  this.object[this.collection][key] = value;
  fs.writeFileSync(this.jsonFile, JSON.stringify(this.object));
  return this.object[this.collection][key];
};

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
