let express = require('express')
let server = express()
let bodyParser = require('body-parser')
let static = require('express-static')

server.listen(1234)
server.use(bodyParser.urlencoded({ extended: false}))

server.post('/one', function (req, res, next) {
  console.log('/one的', req.body)
  res.send('123')
})
server.post('', function (req, res, next) {
  console.log('空的', req.body)
  res.send('123')
})
server.get('/1.html', function (req, res, next) {
  console.log(1, req.query)
  res.send('123')
  // next()
})
// server.get('/1.html', function (req, res, next) {
//   console.log(req.query)
//   res.send('123')
//   next()
// })
server.use(static('./www'))