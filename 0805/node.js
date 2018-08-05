let express = require('express') // 引入express
let server = express() // 实例化express
let bodyParser = require('body-parser') // 中间件,用于获取 post 的传值
let cookieParser = require('cookie-parser') // cookie 操作插件
let static = require('express-static')

server.listen(1234) // 监听 1234 这个端口

// 使用中间件
// 格式化 post 请求的入参,extended 为 false 时,值为数组或string, true为任意数据类型
server.use(bodyParser.urlencoded({ extended: false }))
server.use(cookieParser()) // 使用 cookieParser

// 新建路由
let userRouter = express.Router()
let goodRouter = express.Router()
// 使用路由
server.use('/user', userRouter)
server.use('/good', goodRouter)

// userRouter 路由监听 get 请求 - 设置了接口名
userRouter.get('/get', (req, res, next) => {
  let data = req.query
  console.log(1, data)
  // 设置cookie
  res.cookie(
    'account', // cookie名
    123, // cookie内容
    {
      path: '/get', // cookie 生效的路径
      maxAge: 10000 // 过期时间
    }
  )
  res.paramsData = {
    params: data,
    a: '有人get了'
  }
  if (res.paramsData) {
    console.log(res.paramsData.a, res.paramsData.params)
    res.send(JSON.stringify(res.paramsData.params)) // 发送返回值并结束请求
    return
  }
  res.send('发起了请求') // 发送返回值并结束请求
})

// goodRouter 路由监听 post 请求 - 设置了接口名
goodRouter.post('/post', (req, res, next) => {
  let data = req.body
  res.paramsData = {
    params: data,
    a: '有人post了'
  }
  next()
})


// 可同时监听 get 和 post 请求
server.post('*', (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  if (res.paramsData) {
    console.log(res.paramsData.a, res.paramsData.params)
    res.send(JSON.stringify(res.paramsData.params)) // 发送返回值并结束请求
    return
  }
  res.send('发起了请求') // 发送返回值并结束请求
})

server.use(static('./www'))