var fs = require('fs');
var expect = require('chai').expect;
var Database = require('../lib');

var db;

describe('db#constructor', function() {
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
      done();
    });
  });
});

describe('db#set', function() {
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

describe('db#setSync', function() {
  it('should set a key synchronously', function() {
    db().setSync('testuser', 10);
    var json = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    expect(json).to.be.an('object');
    expect(json['default'].testuser).to.be.a('number');
    expect(json['default'].testuser).to.equal(10);
  });
});

describe('db#get', function() {
  it('should get a key', function(done) {
    db().get('key', function(err, key) {
      if (err) return done(err);
      expect(key).to.be.a('string');
      expect(key).to.equal('value');
      done();
    });
  }); 
});

describe('db#getSync', function() {
  it('should get a key synchronously', function() {
    var key = db().getSync('key');
    expect(key).to.be.a('string');
    expect(key).to.equal('value');
  }); 
});
