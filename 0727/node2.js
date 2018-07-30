let http = require('http') // 一个http只能监听一个接口
// let http2 = require('http') // 一个http只能监听一个接口

let num = 1
let serverFn = function(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*')
  console.log('demo2，次数：' + num++)
  // console.log(request.url) // 控制台打印请求的链接
  response.write('i\'m node.js --- ' + request.url) // res为这个字符串
  response.end() // 结束请求
}
http.createServer(serverFn).listen(9217) //新建服务  监听接口
