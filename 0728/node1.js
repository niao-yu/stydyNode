let http = require('http')
let querystring = require('querystring')

// post请求
let serverFn = function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  // console.log(req)
  let str = ''
  req.on('data', function(data) {
    str += data
  })
  req.on('end', function() {
    let data = querystring.parse(str)
    if (data.user === 'leo' && data.pass === '123') {
      res.write('1')
    } else res.write('0')
    res.end()
  })
}
http.createServer(serverFn).listen(1234)