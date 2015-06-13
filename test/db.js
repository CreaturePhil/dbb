var fs = require('fs');
var expect = require('chai').expect;
var PickleDB = require('../lib');

var db;

describe('PickleDB#constructor', function() {
  it('should create a new PickleDB', function() {
    db = new PickleDB('db.json');
    expect(db).to.be.an.instanceof(PickleDB);
    expect(db).to.have.any.keys('file', 'cacheObject');
    expect(db.file).to.equal('db.json');
    expect(db.cacheObject).to.eql({});
  });

  it('should have a json file', function(done) {
    fs.exists('db.json', function(exists) {
      setTimeout(function() {
        expect(exists).to.be.true;
        done();
      }, 50);
    });
  });
});

describe('PickleDB#set', function() {
  it('should have set property', function() {
    expect(PickleDB).to.respondTo('set');
    expect(db).to.respondTo('set');
  });

  it('should set a key in the database', function(done) {
    db.set('key', 'value', function() {
      fs.readFile('db.json', 'utf8', function(err, data) {
        if (err) return done(err);
        var object = JSON.parse(data);
        expect(object).to.be.an('object');
        expect(object).to.have.any.keys('key');
        expect(object.key).to.be.a('string');
        expect(object.key).to.equal('value');
        done();
      });
    });
  });

  it('should have a cacheObject', function() {
    expect(db.cacheObject).to.be.an('object');  
    expect(db.cacheObject).to.have.any.keys('key');
    expect(db.cacheObject).to.eql({key: 'value'});
  });
});

describe('PickleDB#get', function() {
  it('should get a key', function(done) {
    db.get('key', function(key) {
      console.log(key);
      expect(key).to.be.a('string');
      expect(key).to.equal('value');
      done();
    });
  });
});

describe('PickleDB#drop', function() {
  it('should remove the json file', function(done) {
    db.drop();
    setTimeout(function() {
      fs.exists('db.json', function(exists) {
        expect(exists).to.be.false;
        done();
      });
    }, 50);
  });
});

