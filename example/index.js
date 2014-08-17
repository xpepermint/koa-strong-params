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
  // this.body = this.params['id'];
  // this.body = this.params.only('name', 'age');
  // this.body = this.params.except('gender');
  // this.body = this.params.require('user').only('id', 'name');
});
app.listen(3001);
