# db

## API

* [`connect`](#connect)

### Documents

* [`get`](#get)
* [`getSync`](#getSync)
* [`set`](#set)
* [`setSync`](#setSync)
* [`remove`](#remove)
* [`removeSync`](#removeSync)

### Collections

* [`insert`](#insert)
* [`insertSync`](#insertSync)
* [`find`](#find)
* [`findSync`](#findSync)

<a name="connect" />
### connect

```js
connect(file)
```

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
the JSON file have finished, or an error occurs. Value is the key's value.

__Examples__

```javascript
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

```javascript
var key = db.get('key');
// do something with key
```

<a name="set" />
### set(key, value, [callback])

Set a key with a value in the database.

__Arguments__

1. `key` (String): Name of the key.
2. `value` (*): Value of the key.
2. `callback(err, value)` (Function): A callback which is called when writing
the JSON file have finished, or an error occurs. Value is the key's value.

__Examples__

```javascript
db.set('key', 'value', function(err, value) {
  if (err) throw err;
  // key-value is now save in the database
  // do something with value
});
```

<a name="setSync" />
### setSync(key, value)

Synchronous `set`. Returns undefined.

__Arguments__

1. `key` (String): Name of the key.
2. `value` (*): Value of the key.
the JSON file have finished, or an error occurs. Value is the key's value.

__Examples__

```javascript
db.set('key', 'value');
```
