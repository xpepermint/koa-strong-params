var params = require('../..')
var express = require('express')
var bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(params.expressMiddleware())
app.listen(3001)
