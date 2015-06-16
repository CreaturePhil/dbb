var fs = require('fs');
var expect = require('chai').expect;
var Database = require('../lib');

var db;

describe('dbb#constructor', function() {
  it('should create the database', function() {
    db = new Database('db.json');
    expect(db).to.be.an('function');
    expect(db()).to.be.an('object');
    expect(db().file).to.equal('db.json');
    expect(db().collection).to.equal('default');
  });

  it('should have the file', function(done) {
    fs.exists('db.json', function(exists) {
      expect(exists).to.be.true;
      db = new Database('db.json');
      done();
    });
  });
});

describe('dbb#set', function() {
  it('should set a key', function(done) {
    db().set('key', 'value', function() {
      fs.readFile('db.json', 'utf8', function(err, data) {
        if (err) return done(err);
        var json = JSON.parse(data);
        expect(json).to.be.an('object');
        expect(json['default'].key).to.be.a('string');
        expect(json['default'].key).to.equal('value');
        done();
      });
    });
  });
});

describe('dbb#setSync', function() {
  it('should set a key synchronously', function() {
    db().setSync('testuser', 10);
    var json = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    expect(json).to.be.an('object');
    expect(json['default'].testuser).to.be.a('number');
    expect(json['default'].testuser).to.equal(10);
  });
});

describe('dbb#get', function() {
  it('should get a key', function(done) {
    db().get('key', function(err, key) {
      if (err) return done(err);
      expect(key).to.be.a('string');
      expect(key).to.equal('value');
      done();
    });
  });

  it('should get a missing key', function(done) {
    db('users').get('missing key', function(err, key) {
      if (err) return done(err);
      expect(key).to.not.exist;
      db().get('missing key', function(err, key) {
        if (err) return done(err);
        expect(key).to.not.exist;
        done();
      });
    });
  });
});

describe('dbb#getSync', function() {
  it('should get a key synchronously', function() {
    var key = db().getSync('key');
    expect(key).to.be.a('string');
    expect(key).to.equal('value');
  });
});

describe('dbb#remove', function() {
  it('should remove a key', function(done) {
    db().remove('key', function(err) {
      if (err) return done(err);
      fs.readFile('db.json', 'utf8', function(err, data) {
        if (err) return done(err);
        var json = JSON.parse(data);
        expect(json).to.be.an('object');
        expect(json['default'].key).to.not.be.a('string');
        expect(json['default'].key).to.not.equal('value');
        done();
      });
    });
  });
});

describe('dbb#removeSync', function() {
  it('should remove a key synchronously', function() {
    db().removeSync('key');
    var key = db().getSync('key');
    expect(key).to.not.be.a('string');
    expect(key).to.not.equal('value');
  });
});

describe('dbb#getAll and db#findAllSync', function() {
  it('should get the whole collection', function(done) {
    db().getAll(function(err, doc) {
      if (err) return done(err);
      expect(doc).to.be.a('object');
      console.log(doc);
      db().findAll(function(err, doc) {
        expect(doc).to.be.a('object');
        done();
      });
    });
  });
});

describe('dbb#getAllSync and db#findALlSync', function() {
  it('should get the whole collection', function() {
    var doc = db().getAllSync();
    expect(doc).to.be.a('object');
    doc = db().findAllSync();
    expect(doc).to.be.a('object');
  });
});

describe('dbb#insert', function() {
  it('should insert a document', function(done) {
    db('users').insert({name: 'phil'}, function(err) {
      if (err) return done(err);
      fs.readFile('db.json', 'utf8', function(err, data) {
        if (err) return done(err);
        var json = JSON.parse(data);
        expect(json).to.be.an('object');
        expect(json.users).to.be.a('array');
        expect(json.users.length).to.equal(1);
        expect(json.users[0]).to.be.an('object');
        expect(json.users[0]._id).to.be.a('string');
        expect(json.users[0]).to.have.deep.property('name', 'phil');
        done();
      });
    });
  });

  it('should override the document', function(done) {
    db('users').set('override', 'bye bye', function() {
      fs.readFile('db.json', 'utf8', function(err, data) {
        if (err) return done(err);
        var json = JSON.parse(data);
        expect(json).to.be.an('object');
        expect(json.users.override).to.be.a('string');
        expect(json.users.override).to.equal('bye bye');
        done();
      });
    });
  });
});

describe('dbb#insertSync', function() {
  it('should insert a document synchronously', function() {
    db('users').insertSync({name: 'jack'});
    var json = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    expect(json).to.be.an('object');
    expect(json.users).to.be.a('array');
    expect(json.users.length).to.equal(1);
    expect(json.users[0]).to.be.an('object');
    expect(json.users[0]._id).to.be.a('string');
    expect(json.users[0]).to.have.deep.property('name', 'jack');
  });

  it('should override the document synchronous', function(done) {
    db('users').setSync('override', 'bye bye');
    var json = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    expect(json).to.be.an('object');
    expect(json.users.override).to.be.a('string');
    expect(json.users.override).to.equal('bye bye');
    done();
  });
});

describe('dbb#find', function() {
  before(function() {
    db('users').insertSync({name: 'phil'});
    db('users').insertSync({name: 'jack'});
    db('users').insertSync({name: 'nick'});
  });

  it('should find an object', function(done) {
    db('users').find({name: 'phil'}, function(err, doc) {
      if (err) return done(err);
      expect(doc).to.be.an('object');
      expect(doc).to.have.any.keys('name', '_id');
      done();
    });
  });
});
