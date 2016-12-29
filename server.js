var path = require('path')
var express = require('express')

var app = express()

app.use(express.static(path.join(__dirname, 'app')))

app.listen('8080')

console.log('started on 8080...')