var fs = require('fs');
var expect = require('chai').expect;
var Chidori = require('../lib');

var db;

describe('Chidori#constructor', function() {
  it('should create a new Chidori database', function() {
    db = Chidori('db.json');
    expect(db).to.be.a('function');
    expect(db()).to.be.an('object');
    expect(db()).to.have.any.keys('jsonFile', 'object', 'collection');
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

  it('should set a users', function() {
    db('users').set('testuser1', {id: 1, name: 'Phil'});
    db('users').set('testuser2', {id: 2, name: 'Jack'});
    db('users').set('testuser3', {id: 3, name: 'Micheal'});
    var json = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    expect(json['users']).to.be.an('object');
    expect(json['users'].testuser1).to.eql({id: 1, name: 'Phil'});
    expect(json['users'].testuser2).to.eql({id: 2, name: 'Jack'});
    expect(json['users'].testuser3).to.eql({id: 3, name: 'Micheal'});
  });  
});

describe('Chidori#get', function() {
  it('should get a key', function() {
    var key = db().get('key');
    expect(key).to.be.a('string');
    expect(key).to.equal('value');
  });
});

describe('Chidori#getAll', function() {
  it('should get all the keys', function() {
    var keys = db().getAll();
    var users = db('users').getAll();
    expect(keys).to.be.an('object');
    expect(users).to.be.an('object');
    expect(keys).to.be.eql({key: 'value'});
    var data = {"testuser1":{"id":1,"name":"Phil"},"testuser2":{"id":2,"name":"Jack"},"testuser3":{"id":3,"name":"Micheal"}};
    expect(users).to.be.eql(data);
  });

});

describe('Chidori#remove', function() {
  it('should remove the key', function() {
    db('users').remove('testuser1');
    var user = db('users').get('testuser1');
    expect(user).to.be.undefined;
  });

  after(function() {
    fs.unlink('db.json', function(err) {
      if (err) throw new Error(err);
    });
  });
});
