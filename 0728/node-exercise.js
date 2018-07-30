let http = require('http')
let querystring = require('querystring')
let fs = require('fs')

let server = function(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*')

  let str = ''
  request.on('data', function(data) {
    str += data
  })
  request.on('end', function(error) {
    if (error) {
      response.write('接收失败')
      response.end()
      return
    }
    let obj = querystring.parse(str)
    fs.writeFile(obj.title, obj.content, function(error) {
      if (error) {
        response.write('文件生成失败:' + error)
        response.end()
        return
      }
      response.write('成功')
      response.end()
    })
  })
}
http.createServer(server).listen(1234)