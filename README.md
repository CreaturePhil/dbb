# dbb

[![Build Status](https://travis-ci.org/CreaturePhil/dbb.svg)](https://travis-ci.org/CreaturePhil/dbb)
[![Dependency Status](https://david-dm.org/CreaturePhil/dbb.svg)](https://david-dm.org/CreaturePhil/dbb)
[![devDependency Status](https://david-dm.org/CreaturePhil/dbb/dev-status.svg)](https://david-dm.org/CreaturePhil/dbb#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/CreaturePhil/dbb/badge.svg)](https://coveralls.io/r/CreaturePhil/dbb)

[![NPM](https://nodei.co/npm/dbb.png?downloads=true&downloadRank=true)](https://nodei.co/npm/dbb)

An easy to use database.

## Example

```js
var DBB = require('dbb');
var db = DBB('db.json');

db('keys').set('key', 'value');
db('posts').insert({ title: 'DBB is amazing' });
```

In `db.json`:

```js
{
  "keys": {
    "key": "value"
  },
  "posts": [
    { "title": "DBB is amazing"  }
  ]
}
```

To query the data:

```js
db('keys').get('key', function(err, key) {
  // do something with key
});
db('posts').find({title: 'DBB is amazing'}, function(err, post) {
  // do something with post
});
```

## Table of Contents

* [Installation](#installation)
* [Guide](#guide)
* [API](#api)
* [Limits](#limits)
* [License](#license)

<a name="installation" />
## Installation

```bash
$ npm install dbb --save
```

<a name="guide" />
## Guide

DBB stores data in a field which can be either be an object or an array.

```js
{
  "field": {},
  "field": []
}
```

`get` and `set` method are for a document, also called an object.

```js
// document
"field": {
  "key": "value",
  "key1": 1,
  "key2": 2
}
```

`find`, `insert`, and `save are for a collection, which is basically an array.`

```js
// collection
"field": [
  { name: "phil", age: 7 },
  { name: "jack", age: 20 },
  { name: "steve", age: 99 }
]
```

For each DBB's method, there is a synchronous version of it. For example, `get` and `getSync` or `find` and `findSync`.

<a name="api" />
## API

* [Create Database](#create)
* [Querying Database](#query)

### Documents

* [`get`](#get)
* [`getSync`](#getSync)
* [`getAll`](#getAll)
* [`getAllSync`](#getAllSync)
* [`set`](#set)
* [`setSync`](#setSync)

### Collections

* [`find`](#find)
* [`findSync`](#findSync)
* [`findAll`](#findAll)
* [`findAllSync`](#findAllSync)
* [`insert`](#insert)
* [`insertSync`](#insertSync)
* [`remove`](#remove)
* [`removeSync`](#removeSync)

<a name="create" />
### Create Database

```js
DBB(file);
```

Specify what JSON file to use. If it doesn't exist, the JSON file will be
created.

__Arguments__

1. `file` (String): JSON file name.

__Examples__

```js
var DBB = require('dbb');
var db = DBB('db.json');
```

<a name="query" />
### Query Database

```js
db(field)
```

__Arguments__

1. `field` (String): Specify what field to query.

__Returns__

(Object): Methods to use to query the database.

__Examples__

```js
db(); // default
db('users');
db('posts').insert({title: 'hello world!'}); // converts to array
```

In json:

```js
{
  "default": {},
  "users": {},
  "posts": [
    {"title": "hello world!"}
  ]
}
```

## Documents

<a name="get" />
### get(key, [callback])

Get a key from the database.

__Arguments__

1. `key` (String): Name of the key.
2. `callback(err, value)` (Function): A callback which is called when reading
the JSON file has finished, or an error occurs. Value is the key's value.

__Examples__

```js
db().get('key', function(err, value) {
  if (err) throw err;
  // do something with value
});
```

<a name="getSync" />
### getSync(key)

Synchronous `key`.

__Arguments__

1. `key` (String): Name of the key.

__Returns__

(*): Key's value

__Examples__

```js
var key = db().get('key');
// do something with key
```

<a name="getAll" />
### getAll([callback])

Get the whole object in the database.

__Arguments__

1. `callback(err, object)` (Function): A callback which is called when reading
the JSON file has finished, or an error occurs.

__Examples__
```js
db().getAll(function(object) {
  // do something with the object.
});
```

<a name="getAllSync" />
### getAllSync([callback])

Get the whole object in the database.

__Arguments__

1. `callback(err, object)` (Function): A callback which is called when reading
the JSON file has finished, or an error occurs.

__Returns__

(Object): Object in the database that holds all the key-value pairs.

__Examples__
```js
var object = db().getAllSync();
// do something with object
```

<a name="set" />
### set(key, value, [callback])

Set a key with a value in the database.

__Arguments__

1. `key` (String): Name of the key.
2. `value` (*): Value of the key.
2. `callback(err)` (Function): *Optional* A callback which is called when
writing to the JSON file has finished, or an error occurs.

__Examples__

```js
db().set('key', 'value', function(err, value) {
  if (err) throw err;
  // key is now save in the database
  // do something with value
});
```

<a name="setSync" />
### setSync(key, value)

Synchronous `set`. Returns undefined.

__Arguments__

1. `key` (String): Name of the key.
2. `value` (*): Value of the key.
the JSON file has finished, or an error occurs. Value is the key's value.

__Examples__

```js
db().setSync('key', 'value');
```

## Collections

<a name="find" />
### find(document, [callback])

Find a document (object) in the database.

__Arguments__

1. `document` (Object): Document also known as a object.
2. `callback(err, doc)` (Function): A callback which is called when
reading to the JSON file has finished, or an error occurs. Doc is the document
(object).

__Examples__

```js
db().find({name: 'Phil'}, function(err, doc) {
  if (err) throw err;
  // do something with doc
});
```
<a name="findSync" />
### findSync(document, [callback])

Synchronous `find`.

__Arguments__

1. `document` (Object): Document also known as a object.

__Returns__

(Object): Document.

__Examples__

```js
var phil = db().findSync({name: 'Phil'});
```

<a name="findAll" />
### findAll([callback])

Get the whole collection in the database.

__Arguments__

1. `callback(err, docs)` (Function): A callback which is called when
reading to the JSON file has finished, or an error occurs. Docs is an array.

__Examples__

```js
db().findAll(function(err, docs) {
  if (err) throw err;
  // do something with docs
});
```

<a name="findAllSync" />
### findAllSync()

Synchronous `findAll`.

__Returns__

(Array): Collection of docs.

__Examples__

```js
var docs = db().getAll();
```

<a name="insert" />
### insert(document, [callback])

Insert a document (object) into the database.

__Arguments__

1. `document` (Object): Document also known as a object.
2. `callback(err, doc)` (Function): *Optional* A callback which is called when
writing to the JSON file has finished, or an error occurs. Doc is the document
inserted.

__Examples__

```js
db().insert({name: 'Phil', email: 'birkal@outlook.com'}, function(err, doc) {
  if (err) throw err;
  // do something with doc
});
```

<a name="insertSync" />
### insertSync(document)

Synchronous `insert`. Returns undefined.

__Arguments__

1. `document` (Object): Document also known as a object.

__Examples__

```js
db().insert({name: 'Phil', email: 'birkal@outlook.com'});
```

<a name="remove" />
### remove(key, [callback])

Remove a key in the database.

__Arguments__

1. `key` (String): Name of the key.
2. `callback(err)` (Function): *Optional* A callback which is called when
writing to the JSON file has finished, or an error occurs.

__Examples__

```js
db().remove('key', function(err) {
  if (err) throw err;
  // key is now remove from the database
});
db('users').remove({name: 'Phil'}, function(err) {
  if (err) throw err;
  // document is now remove from the database
});
```

<a name="removeSync" />
### removeSync(key)

Synchronous `sync`. Returns undefined.

__Arguments__

1. `key` (String): Name of the key.

__Examples__

```js
db().removeSync('key');
db('users').removeSync({name: 'Phil'});
```

<a name="limits" />
## Limits

DBB is a convenient method for storing data without setting up a database server.
However, if you need high performance and scalability more than simplicity, 
you should stick to databases like [MongoDB](https://www.mongodb.org).

<a name="license" />
## License

[MIT](LICENSE)
