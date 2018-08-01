let express = require('express')
let cookieParse = require('cookie-parse')
let static = require('express-static')
let fs = require('fs')

let server = express()

server.listen('1234')

server.use('/', function (req, res, next) {
  fs.readFile('./www' + req.url + '.html', function(err, data) {
    if (err) next()
    else {
      res.write(data)
      res.end()
    }
  })
})


server.post('/register', function (req, res, next) {
  console.log(req.body)
})

server.get('*', function(req, res) {
  fs.readFile('./www/404.html', function(error, data) {
    if (error) {
      res.send('位置错误')
      return
    }
    res.write(data)
    res.end()
  })
})
server.use(static('./www'))