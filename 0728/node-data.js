let http = require('http')
let fs = require('fs')
let querystring = require('querystring')

let readError // 读取文件错误内容
let sqlArr = [] // 数据文件内容
/**
 * 读取数据文件
 * @param {function} success 成功后的函数
 * @param {function} error 成功后的函数
 */
let readData = function(success, error) {
  console.log('开始读取文件')
  fs.readFile('./sqlData.txt', 'utf-8', function(error, data) {
    if (error) { // 读取出错
      if (error.code === 'ENOENT') { // 无此文件,无关紧要
        console.log('无数据文件')
        readError = true
        console.log('无数据文件')
      } else { // 出错
        console.log('读取出错')
        readError = error
        error && error()
      }
    } else { // 文件正常
      console.log('读取完成')
      readError = true
      sqlArr = data ? JSON.parse(data) : []
      success && success()
    }
  })
}
/**
 * 更新数据文件
 * @param {object} newUser 新用户的userName和password
 * @param {function} success 成功后的函数
 * @param {function} error 成功后的函数
 */
let saveData = function(newUser, success, error) {
  sqlArr.push(newUser)
  fs.writeFile('sqlData.txt', JSON.stringify(sqlArr), function(err) {
    if (err) { // 存取错误
      console.log('存取错误')
      if (error) error(err)
      else {
        
        response.write('存取错误文件失败：' + err)
        response.end()
      }
    } else { // 存储成功
      console.log('存储成功')
      if (success) success()
      else {
        response.write('存取错误文件失败：' + err)
        response.end()
      }
    }
  })
}

// 读取数据
// readData()
/**
 * http服务体
 * @param {object} request 请求对象
 * @param {object} response 响应对象
 */
let server = function(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*')
  console.log('接口被调用')
  /**
   * 文件读取成功后的操作
   */
  let success = function() {
    if (readError === undefined) {
      console.log('服务尚未完成初始化,请稍后再试')
      response.write('服务尚未完成初始化,请稍后再试')
      response.end()
      return
    }
    if (readError !== true) {
      console.log('读取数据文件失败：' + readError)
      response.write('读取数据文件失败：' + readError)
      response.end()
      return
    }
    let str = '' // {string} 接收的数据 
    request.on('data', function(data) {
      str += data
    })
    request.on('end', function(error) {
      if (error) {
        console.log('接收失败：' + error)
        response.write('接收失败：' + error)
        response.end()
        return
      } else {
        console.log('接收完成')
        let obj = querystring.parse(str) // {object} 接收的数据
        let index // 用户索引值
        for (let i = 0; i < sqlArr.length; i++) {
          if (sqlArr[i].userName === obj.userName) {
            index = i
            break
          }
        }
        console.log('用户检索完成')
        if (index === undefined) { // 无此用户,注册
          console.log('无此用户,注册')
          saveData(obj, function() {
            response.write('欢迎用户 ' + obj.userName + ' 注册')
            response.end()
          })
        } else { // 存在此用户
          console.log('存在此用户')
          if ((sqlArr[index].password !== obj.password)) { // 密码错误
            console.log('密码错误')
            response.write('密码错误')
          } else response.write('欢迎 ' + sqlArr[index].userName + ' 回来')
          response.end()
        }
      }
    })
  }
  readData(success)
}

http.createServer(server).listen(1234)