let http = require('http')
let urlLib = require('url')

// get请求

let num = 1
let server = function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  console.log('被请求：' + num++)
  let obj = urlLib.parse(req.url, true).query
  console.log(obj)
  // let url = req.url.substring(2)
  // let arr = url.split('&')
  // let obj = {}
  // for (let i = 0; i < arr.length; i++) {
  //   obj[arr[i].split('=')[0]] = arr[i].split('=')[1]
  // }
  if (obj.user === 'leo' && obj.pass === '123') res.write('1')
  else res.write('0')
  res.end()
}

http.createServer(server).listen(1234)