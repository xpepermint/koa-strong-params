# koa-strong-params

![Build Status](https://travis-ci.org/xpepermint/koa-strong-params.svg?branch=master)&nbsp;[![NPM version](https://badge.fury.io/js/koa-strong-params.svg)](http://badge.fury.io/js/koa-strong-params)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/koa-strong-params.svg)](https://gemnasium.com/xpepermint/koa-strong-params)

Rails-style implementation of strong parameters for [Koa](https://github.com/koajs/koa). The middleware adds the `this.params` object to the [Koa context](http://koajs.com/#context) which returns an object, built from `query string` and `request body` data. The returned object has some useful methods allows for data `requiring` and `filtering`.

You should consider using [koa-qs](https://www.npmjs.org/package/koa-qs) and [koa-bodyparser](https://www.npmjs.org/package/koa-bodyparser) packages together with `koa-strong-params`.

## Installation

Install the [npm](https://www.npmjs.org/package/koa-strong-params) package.

```
npm install koa-strong-params --save
```

Attach the middleware.

```js
var koa = require('koa');
var params = require('koa-strong-params');
var app = koa();
app.use(params());
```


## Example

```js
var koa = require('koa');
var params = require('koa-strong-params');
var bodyparser = require('koa-bodyparser');
var qs = require('koa-qs')
var app = koa();
qs(app); // required for nested query string objects
app.use(bodyparser()); // required for params to include request body objects
app.use(params());
app.use(function *() {

  // all available params
  this.body = this.params.all();
  // -> { id: '13', name: 'Bob', age: '13', email: 'bob@gmail.com', address: { country: 'US', street: '261 West' }}

  // only selected params
  this.body = this.params.only('name', 'age');
  // -> { name: 'Bob', age: '13' }

  // all params except those provided
  this.body = this.params.except('name', 'id', 'address');
  // -> { id: '13', age: '13', email: 'bob@email.com' }

  // all params of a sub-object
  this.body = this.params.require('address').all();
  // -> { country: 'US', street: '261 West' }

  // only selected params + some merged attributes
  this.body = this.params.merge({ badge: 'coder' }).only('name');
  // -> { name: 'Bob', badge: 'coder' }

});
app.listen(3001);
```
