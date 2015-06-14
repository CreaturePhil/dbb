# chidori

Lightning quick database.

# Example

```js
var chidori = require('chidori');
var db = chidori('db.json');

db('money').set('phil', 10);
db().set('posts', [{title: 'chidori is amazing'}]);
```

In `db.json`:

```js
{
  "money": { "phil":10 },
  "default": {
    "posts": [
      {"title":"chidori is amazing"}
    ]
  }
}
```

To retreive the data, simply do:

```js
db('money').get('phil');
db().get('posts')[0];
```
// TODO: add optional parameter db().get('posts', {title: 'chidori is amazing'}) to query for objects.
// possible update for set for `:` syntax
db('money').set('phil:add', 2);
db('money').update('phil').add(2);

# Limits

chidori is a convenient method for storing data without setting up a database
server. However, if you need high performance and scalability more than 
simplicity, you should stick to databases like [MongoDB][MongoDb].

[MongoDB]: https://www.mongodb.org
