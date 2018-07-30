let fs = require('fs')

fs.readFile('./aaa.txt', function(error, data) {
  if (error) {
    console.log('打开错误：' + error)
    return
  }
  fs.writeFile('aaa2.txt', data, function(error) {
    if (error) {
      console.log('文件写入错误')
      return
    }
    console.log('文件写入成功')
  })
})