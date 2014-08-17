var params = require('..');
var koa = require('koa');
var bodyparser = require('koa-bodyparser');
var qs = require('koa-qs')
var request = require('request');


// should always return an instance
//

describe('middleware', function() {

  beforeEach(function() {
    this.port = 3001;
    this.url = 'http://localhost:'+this.port;
    this.app = koa();
    qs(this.app);
    this.app.use(bodyparser());
    this.app.use(params());
  });

  afterEach(function() {
    if (this.server) this.server.close();
  });

  describe('this.params.all()', function() {

    it('should return `all` params', function(done) {
      this.app.use(function *() {
        this.body = this.params.all();
      });
      this.server = this.app.listen(this.port);

      request.post({ url: this.url+'/?p1=1&p2=2', form: { a1: 1, a2: 2 }}, function(err, res, body) {
        expect(JSON.parse(body)).toEqual({ p1: '1', p2: '2', a1: '1', a2: '2' });
        done();
      });
    });

  });

  describe('this.params.only()', function() {

    it('should return `only` selected params', function(done) {
      this.app.use(function *() {
        this.body = this.params.only('p1', ['a2']);
      });
      this.server = this.app.listen(this.port);

      request.post({ url: this.url+'/?p1=1&p2=2', form: { a1: 1, a2: 2 }}, function(err, res, body) {
        expect(JSON.parse(body)).toEqual({ p1: '1', a2: '2' });
        done();
      });
    });

  });

  describe('this.params.except()', function() {

    it('should return all params `except` those selected', function(done) {
      this.app.use(function *() {
        this.body = this.params.except('p1', ['a2']);
      });
      this.server = this.app.listen(this.port);

      request.post({ url: this.url+'/?p1=1&p2=2', form: { a1: 1, a2: 2 }}, function(err, res, body) {
        expect(JSON.parse(body)).toEqual({ p2: '2', a1: '1' });
        done();
      });
    });

  });

  describe('this.params.require()', function() {

    it('should return a `params` object of the required key', function(done) {
      this.app.use(function *() {
        this.body = this.params.require('p1').all();
      });
      this.server = this.app.listen(this.port);

      request.post({ url: this.url+'/?p1[s1]=1&p2=2', form: { p1: { s2: 2 } , a2: 2 }}, function(err, res, body) {
        expect(JSON.parse(body)).toEqual({ s1: '1', s2: '2' });
        done();
      });
    });

    it('should throw an exception if the required key does not exist', function() {
      this.app.use(function *() {
        this.body = this.params.require('xx').all();
      });
      this.server = this.app.listen(this.port);

      request.post({ url: this.url+'/?p1=1', form: { a1: 1 }}, function(err, res, body) {
        expect(body).toEqual(undefined);
        done();
      });
    });

  });

});
