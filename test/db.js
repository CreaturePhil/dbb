var fs = require('fs');
var expect = require('chai').expect;
var Chidori = require('../lib');

var db;

describe('Chidori#constructor', function() {
  it('should create a new Chidori database', function() {
    db = Chidori('db.json');
    expect(db).to.be.a('function');
    expect(db()).to.be.an('object');
    expect(db()).to.have.any.keys('jsonFile', 'cache', 'collection');
    expect(db().collection).to.be.a('string');
    expect(db().collection).to.equal('default');
    expect(db()).to.respondTo('get');
    expect(db()).to.respondTo('set');
  });

  it('should create a json file', function(done) {
    fs.exists('db.json', function(exists) {
      expect(exists).to.be.true;
      done();
    });
  });
});

describe('Chidori#set', function() {
  it('should set a key with a value', function() {
    var key = db().set('key', 'value');    
    expect(key).to.equal('value');
    var json = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    expect(json['default']).to.be.an('object');
    expect(json['default'].key).to.equal('value');
  });  
});

describe('Chidori#get', function() {
  it('should get a key', function() {
    var key = db().get('key');
    expect(key).to.be.a('string');
    expect(key).to.equal('value');
  });
});
