# strong-params

![Build Status](https://travis-ci.org/ssowonny/strong-params.svg?branch=master)&nbsp;[![NPM version](https://badge.fury.io/js/strong-params.svg)](http://badge.fury.io/js/strong-params)

Rails-style implementation of strong parameters (forked from [koa-strong-params](https://github.com/xpepermint/koa-strong-params)). It supports [Express](http://expressjs.com/), [Koa](https://github.com/koajs/koa) and also can be used as standalone. The middleware adds the `parameters` object to the [Express request](http://expressjs.com/4x/api.html#req) (or `this.params` for [Koa context](http://koajs.com/#context)) which returns an object, built from `query string`, `request body` and `route params` data. The returned object has some useful methods allows for data `requiring` and `filtering`.

## Installation

Install the [npm](https://www.npmjs.org/package/strong-params) package.

```
npm install strong-params --save
```

#### Attach the middleware.

##### Express

```js
var express = require('express')
var params = require('strong-params')
app.use(params.expressMiddleware())
```

##### Koa

```js
var koa = require('koa')
var params = require('strong-params')
var app = koa()
app.use(params.koaMiddleware())
```

## Usage

### Get strong parameters

##### Express

```js
app.use(function (req, res, next) {
  var params = req.parameters
})
```

##### Koa

```js
app.use(function *() {
  var params = this.params
})
```

##### Standalone

```js
var strongify = require('strong-params').strongify
var params = strongify({ key: 'value' })
```

### Methods

```js
// All available params
params.all()
// -> { id: '13', name: 'Bob', age: '13', email: 'bob@gmail.com', address: { country: 'US', street: '261 West' }}

// Only selected params (also has `only` as alias for `permit`)
params.permit('name', 'age')
// -> { name: 'Bob', age: '13' }

// All params except those provided
params.except('name', 'id', 'address')
// -> { id: '13', age: '13', email: 'bob@email.com' }

// All params of a sub-object
params.require('address').all()
// -> { country: 'US', street: '261 West' }

// Only selected params + some merged attributes
params.merge({ badge: 'coder' }).permit('name')
// -> { name: 'Bob', badge: 'coder' }
```

## Contributing

Please follow [Contributing](./CONTRIBUTING.md)
