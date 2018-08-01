let express = require('express')
let cookieParser = require('cookie-parser')
let static = require('express-static')
let server = express()

server.listen('1234')
server.use(cookieParser())
server.get('', function(request, response) {
  console.log(request.cookies)
  // response.cookie('userId', 123456, {maxAge: 10000})
  response.end()
})
server.use(static('./'))