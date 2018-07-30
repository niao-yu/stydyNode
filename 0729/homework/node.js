let http = require('http')
let querystring = require('querystring')
let fs = require('fs')

/**
 * 读取入参
 * @param {object} obj {request, success, error, port}
 */
let getQuery = function(obj) {
  if (!arguments[0]) {
    console.log('请输入入参')
    return
  }
  let {request, success, error, port} = obj
  let str = '' // 接参数
  request.on('data', function(data) {
    str += data
  })
  request.on('end', function(err) {
    if (err) {
      console.log(port + '---接参错误: ' + err)
      error && error(err)
    } else {
      console.log(port + '---接参成功')
      let obj = querystring.parse(str)
      if (success) success && success(obj)
    }
  })
}

/**
 * 读取数据库
 * @param {object} obj {fileName, success, error, port}
 */
let readData = function(obj) {
  if (!arguments[0]) {
    console.log('请输入入参')
    return
  }
  let {fileName, success, error, port} = obj
  fs.readFile(fileName, 'utf8', function(err, data) {
    if (err && err.code !== 'ENOENT') { // 读取出错
      console.log(port + '---读取数据文件出错')
      error && error(err)
    } else { // 读取完成
      console.log(port + '---读取数据文件成功')
      if (success) success(data ? JSON.parse(data) : [])
      else console.log(port + '---请定义读取数据成功回调函数')
    }
  })
}


/**
 * 存储数据库
 * @param {object} obj {fileName, allData, success, error, port}
 */
let saveData = function(obj) {
  if (!arguments[0]) {
    console.log('请输入入参')
    return
  }
  let {fileName, allData, success, error, port} = obj
  fs.writeFile(fileName, allData, function(err) {
    if (err) { // 存储出错
      console.log(port + '---存储数据文件出错')
      error && error(err)
    } else { // 存储完成
      console.log(port + '---存储数据文件成功')
      success && success()
    }
  })
}

/**
 * 服务整体
 * @param {object} request 请求体
 * @param {object} response 响应体
 */
let server_login_1234 = function(request, response) {
  response.setHeader('Access-Control-Allow-Origin', '*')
  let params, _port = '1234'
  console.log(_port + '---接口被调用')
  /**
   * 入参获取完成后的回调
   * @param {object} data 入参
   */
  let _getQueryFn = function(data) {
    params = data // 保存入参
    // 读取数据文件
    readData({
      port: _port,
      fileName: 'userMsg.txt',
      success: _getDataFn
    })
  }

  /**
   * 完成服务
   * @param {object} obj {response, port, data}
   */
  let endServer = function(obj) {
    if (!arguments[0]) {
      console.log('请输入入参')
      return
    }
    let {response, port, data} = obj
    if (port) console.log(port + '---完成服务')
    response.write(data)
    response.end()
  }

  /**
   * 读取数据库文件完成后
   * @param {object} data 数据库文件arr
   */
  let _getDataFn = function(allData) {
    // 对比数据
    let index
    for (let i = 0; i < allData.length; i++) {
      if (allData[i].account === params.account) { // 存在此用户
        index = i
        break
      }
    }
    if (index === undefined) { // 无此用户
      console.log(_port + '---无此用户,自动创建')
      let newUser = {
        account: params.account,
        password: params.password,
        admin: params.admin,
        nickname: params.account + '_' + Math.floor(Math.random() * 1000),
        userId: new Date().getTime() + '' + Math.floor(Math.random() * 1000)
      }
      allData.push(newUser)
      saveData({
        fileName: 'userMsg.txt',
        allData: JSON.stringify(allData),
        success: function() {
          endServer({
            port: _port,
            response: response,
            data: JSON.stringify({
              data: newUser,
              code: 1,
              msg: '登陆成功 --- 非用户 => ' + (params.admin === '1' ? '管理员: ' : '用户: ') +  params.account
            })
          })
        },
        port: _port
      })
      return
    }
    console.log(_port + '---存在此用户')
    if (allData[index].password !== params.password) { // 密码错误
      console.log(_port + '---密码错误')
      endServer({
        port: _port,
        response: response,
        data: JSON.stringify({
          data: null,
          code: 0,
          msg: '密码错误'
        })
      })
    } else { // 密码正确
      console.log(_port + '---密码正确')
      if (params.admin === '1') { // 勾选了管理员
        console.log('---dd' + allData[index].admin)
        if (allData[index].admin === '1') { // 本身就是管理员
          endServer({
            port: _port,
            response: response,
            data: JSON.stringify({
              data: allData[index],
              code: 1,
              msg: '登陆成功 --- 管理员: ' +  params.account
            })
          })
        } else { // 本身不是管理员
          allData[index].admin = '1'
          saveData({
            fileName: 'userMsg.txt',
            allData: JSON.stringify(allData),
            success: function() {
              endServer({
                port: _port,
                response: response,
                data: JSON.stringify({
                  data: allData[index],
                  code: 1,
                  msg: '登陆成功 --- 用户 => 管理员: ' +  params.account
                })
              })
            },
            port: _port
          })
        }
      } else { // 没有勾选管理员
        if (allData[index].admin === '1') { // 本身是管理员
          allData[index].admin = '0'
          saveData({
            fileName: 'userMsg.txt',
            allData: JSON.stringify(allData),
            success: function() {
              endServer({
                port: _port,
                response: response,
                data: JSON.stringify({
                  data: allData[index],
                  code: 1,
                  msg: '登陆成功 --- 管理员 => 用户: ' +  params.account
                })
              })
            },
            port: _port
          })
        } else { // 本身不是管理员
          endServer({
            port: _port,
            response: response,
            data: JSON.stringify({
              data: allData[index],
              code: 1,
              msg: '登陆成功 --- 用户: ' + params.account
            })
          })
        }
      }
    }
  }

  // 读取入参
  getQuery({
    port: _port,
    request: request,
    success: _getQueryFn
  })
}

http.createServer(server_login_1234).listen(1234)