# db

## API

* [`connect`](#connect)

### Documents
// ALPHABETTIZE

* [`get`](#get)
* [`getSync`](#getSync)
* [`remove`](#remove)
* [`removeSync`](#removeSync)
* [`set`](#set)
* [`setSync`](#setSync)

### Collections

* [`find`](#find)
* [`findSync`](#findSync)
* [`insert`](#insert)
* [`insertSync`](#insertSync)

<a name="connect" />
### connect(file)

Specify what JSON file to use. If it doesn't exist, the JSON file will be
created.

__Arguments__

1. `file` (String): JSON file name.

__Examples__

```js
db.connect('db.json');
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
db.get('key', function(err, value) {
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
var key = db.get('key');
// do something with key
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
db.remove('key', function(err) {
  if (err) throw err;
  // key is now remove from the database
});
```

<a name="removeSync" />
### removeSync(key)

Synchronous `sync`. Returns undefined.

__Arguments__

1. `key` (String): Name of the key.

__Examples__

```js
db.removeSync('key');
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
db.set('key', 'value', function(err, value) {
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
db.setSync('key', 'value');
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
db.find({name: 'Phil'}, function(err, doc) {
  if (err) throw err;
  // do something with doc
});
```
<a name="findSync" />
### find(document, [callback])

Synchronous `find`.

__Arguments__

1. `document` (Object): Document also known as a object.

__Returns__

(Object): Document

__Examples__

```js
var phil = db.findSync({name: 'Phil'});
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
db.insert({name: 'Phil', email: 'birkal@outlook.com'}, function(err, doc) {
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
db.insert({name: 'Phil', email: 'birkal@outlook.com'});
```
