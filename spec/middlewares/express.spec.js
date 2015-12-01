var params = require('../..')
var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')

describe('expressMiddleware', function () {

  beforeEach(function () {
    this.port = 3001
    this.url = 'http://localhost:' + this.port
    this.app = express()
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded())
    this.app.use(params.expressMiddleware())
  })

  afterEach(function () {
    if (this.server) {
      this.server.close()
    }
  })

  describe('this.params.all()', function () {
    it('should return `all` params', function (done) {
      this.app.use(function (req, res, next) {
        res.json(req.parameters.all())
      })
      this.server = this.app.listen(this.port)

      request.post({ url: this.url + '/?p1=1&p2=2', form: { a1: 1, a2: 2 } }, function (err, res, body) {
        expect(JSON.parse(body)).toEqual({ p1: '1', p2: '2', a1: '1', a2: '2' })
        done(err)
      })
    })
  })

  describe('this.params.only()', function () {
    it('should return `only` selected params', function (done) {
      this.app.use(function (req, res, next) {
        res.json(req.parameters.only('p1', ['a2']))
      })
      this.server = this.app.listen(this.port)

      request.post({ url: this.url + '/?p1=1&p2=2', form: { a1: 1, a2: 2 } }, function (err, res, body) {
        expect(JSON.parse(body)).toEqual({ p1: '1', a2: '2' })
        done(err)
      })
    })

  })

  describe('this.params.except()', function () {

    it('should return all params `except` those selected', function (done) {
      this.app.use(function (req, res, next) {
        res.json(req.parameters.except('p1', ['a2']))
      })
      this.server = this.app.listen(this.port)

      request.post({ url: this.url + '/?p1=1&p2=2', form: { a1: 1, a2: 2 } }, function (err, res, body) {
        expect(JSON.parse(body)).toEqual({ p2: '2', a1: '1' })
        done(err)
      })
    })
  })

  describe('this.params.require()', function () {

    it('should return a `params` object of the required key', function (done) {
      this.app.use(function (req, res, next) {
        res.json(req.parameters.require('p1').all())
      })
      this.server = this.app.listen(this.port)

      request.post({ url: this.url + '/?p1[s1]=1&p2=2', form: { p1: { s2: 2 } , a2: 2 } }, function (err, res, body) {
        expect(JSON.parse(body)).toEqual({ s1: '1', s2: '2' })
        done(err)
      })
    })

    it('should throw an exception if the required key does not exist', function (done) {
      this.app.use(function (req, res, next) {
        res.json(req.parameters.require('xx').all())
      })
      this.app.use(function (req, res, next) {
        res.status(500).send()
      })
      this.server = this.app.listen(this.port)

      request.post({ url: this.url + '/?p1=1', form: { a1: 1 } }, function (err, res, body) {
        expect(res.statusCode).toEqual(500)
        done(err)
      })
    })
  })
})
