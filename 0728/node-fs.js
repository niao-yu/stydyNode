// 引入服务
let fs = require('fs')
let http = require('http')
let querystring = require('querystring')

let server = function(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*')

  let str = ''
  request.on('data', function(data) {
    console.log(data)
    str += data
  })
  request.on('end', function(error) {
    if (error) {
      response.write('上传出错')
      return
    }
    let obj = querystring.parse(str)
    fs.writeFile('aaa.txt', obj.str, function(err) {
      if (err) {
        response.write('文件写入出错')
        return
      }
      response.write('成功')
      response.end()
    })
  })
}
http.createServer(server).listen(1234)