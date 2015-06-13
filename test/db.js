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
      expect(key).to.be.a('string');
      expect(key).to.equal('value');
      done();
    });
  });

  it('should get not get a key', function(done) {
    db.get('key1', function(key) {
      expect(key).to.not.be.a('string');
      expect(key).to.not.equal('value');
      expect(key).to.not.exist;
      done();
    });
  });

  it('should get all keys', function(done) {
    db.set('foo', 'bar', function() {
      db.get(function(keys) {
        expect(keys).to.be.an('object');
        expect(keys).to.have.any.keys('key', 'foo');
        expect(keys.key).to.be.eql('value');
        expect(keys.foo).to.be.eql('bar');
        expect(keys).to.be.eql(db.cacheObject);
        done();
      });    
    });
  });
});

describe('PickleDB#remove', function() {
  it('should remove a key', function(done) {
    db.remove('key', function() {
      db.get('key', function(key) {
        expect(key).to.not.exist;
        done();
      });
    });
  });

  it('should not have key in cacheObject', function() {
    expect(db.cacheObject).to.be.an('object');  
    expect(db.cacheObject).to.not.have.any.keys('key');
    expect(db.cacheObject).to.not.eql({key: 'value'});
    expect(db.cacheObject.key).to.not.exist;
  });
});

describe('PickleDB#populate', function() {
  it('should add all these keys to the database', function(done) {
    db.populate({a: 1, b: 2, c: 3}, function() {
      db.get(function(keys) {
        expect(keys).to.be.an('object');
        expect(keys).to.have.any.keys('key', 'a', 'b', 'c');
        expect(keys.a).to.be.eql(1);
        expect(keys.b).to.be.eql(2);
        expect(keys.c).to.be.eql(3);
        expect(keys).to.be.eql(db.cacheObject);
        done();
      });
    });
  });
});

describe('PickleDB#drop', function() {
  it('should remove the json file', function(done) {
    db.get(function(object) {
      console.log(object); 
      db.drop();
      setTimeout(function() {
        fs.exists('db.json', function(exists) {
          expect(exists).to.be.false;
          done();
        });
      }, 50);
    });
  });
});

