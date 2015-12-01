var params = require('..');
var koa = require('koa');
var bodyparser = require('koa-bodyparser');
var qs = require('koa-qs')

var app = koa();
qs(app); // required for nested query string objects
app.use(bodyparser()); // required for params to include request body objects
app.use(params());
app.use(function *() {
  this.body = this.params.all();
});
app.listen(3001);
