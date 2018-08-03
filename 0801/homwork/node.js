let express = require('express')
let cookieParser = require('cookie-parser')
let static = require('express-static')
let fs = require('fs')
let bodyParser = require('body-parser')

let server = express()

server.listen('1234')

server.use(static('./www'))
server.use(cookieParser())
server.use(bodyParser.urlencoded({extended: false}))


let userFilePath = './www/userMsg'
let userDataAll = []
server.post('/register', function (req, res) {
  console.log(req.body)
  let body = req.body
  readFile(userFilePath, data => {
    console.log('data', data)
    userDataAll = data ? JSON.parse(data) : []
    for (let i = 0; i < userDataAll.length; i++) {
      if (userDataAll[i].account === body.account) {
        res.send({
          data: 0,
          msg: '用户已存在'
        })
        return
      }
    }
    let obj = {
      account: body.account,
      password: body.password
    }
    userDataAll.push(obj)
    writeFile(userFilePath, JSON.stringify(userDataAll), () => {
      res.send({
        data: 1
      })
    })
  }, err => {
    if (err.code === 'ENOENT') {
      userDataAll = []
      let obj = {
        account: body.account,
        password: body.password
      }
      userDataAll.push(obj)
      writeFile(JSON.stringify(userFilePath), userDataAll, () => {
        res.send({
          data: 1
        })
      })
    }
  })
})

server.post('/login', function (req, res) {
  let body = req.body
  readFile(userFilePath, data => {
    userDataAll = data ? JSON.parse(data) : []
    for (let i = 0; i < userDataAll.length; i++) {
      if (userDataAll[i].account === body.account && userDataAll[i].password !== body.password) {
        res.send({
          data: 0,
          msg: '密码错误'
        })
        return
      } else if (userDataAll[i].account === body.account && userDataAll[i].password === body.password) {
        console.log('登陆成功')
        // 设置cookie
        res.cookie('account', body.account)
        res.cookie('password', body.password)
        res.send({
          data: 1
        })
        return
      }
    }
    res.send({
      data: 0,
      msg: '无此用户,请注册'
    })
  })
})


server.post('/register', function (req, res, next) {
  console.log(req.body)
})

server.get('*', function(req, res) {
  console.log(req.path)
  readFile('./www/404.html', (data) => res.end(data))
})

/**
 * 读取文件
 * @param {string} fileName 读取的文件名字
 * @param {function} success 读取成功的回调函数
 * @param {function} error 读取失败的回调函数
 */
function readFile(fileName, success, error) {
  fs.readFile(fileName, 'utf-8', (err, data) => {
    if (err) {
      console.log('读取失败')
      error && error(err)
    } else success(data)
  })
}

/**
 * 存储文件
 * @param {string} fileName 存储的文件名字
 * @param {string} fileName 存储的文件内容
 * @param {function} success 存储成功的回调函数
 * @param {function} error 存储失败的回调函数
 */
function writeFile(fileName, data, success, error) {
  fs.writeFile(fileName, data, (err, data) => {
    if (err) {
      console.log(err)
      console.log('存储失败')
      error && error(err)
    } else success()
  })
}