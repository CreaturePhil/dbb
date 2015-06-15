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
