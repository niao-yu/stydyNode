# node.js 学习笔记汇总
## 整体需要安装的基础软件或工具

* **node.js ( \* 必须)**
* **cnpm 或 yarn (非必须 提速用)**
* **VS code (非必须 代码开发软件)**
* **Chrome(非必须 前端和后台开发最常用的浏览器)**

## 一、 node 起服务的初始操作
> **需要使用npm安装的模块**  
> * 无   

> ### 代码   
> ```
> let http = require('http') // 基础的 http 服务
> let urlLib = require('url') // 格式化 get 请求的传参
> let querystring = require('querystring') // 格式化 post 请求的传参
> 
> // get请求
> let server = function (request, response) {
>   let obj = urlLib.parse(request.url, true).query
>   console.log(obj) // 在node.js服务中,打印数据
>   response.end('0') // 结束请求,否则前台接口一直pending
> }
> 
> // // post请求
> // let server = function (request, response) {
> //   response.setHeader('Access-Control-Allow-Origin', '*') // 允许跨域的请求头
> //   let str = '' // {string} 接收的数据 
> //   // 监听'data'事件,收data的传参
> //   request.on('data', function (data) {
> //     str += data
> //   })
> //   // 监听'end'事件,接参结束
> //   request.on('end', function (error) {
> //     if (error) { // 接参出错
> //       console.log('接收失败：' + error)
> //       response.write('接收失败：' + error)
> //       response.end()
> //       return
> //     } else { // 接参成功
> //       // 用 querystring 格式化接收到的参数
> //       let obj = querystring.parse(str) // {object} 接收的数据
> //       console.log('接收完成:', obj)
> //       response.write('参数为 ' + JSON.stringify(obj)) // 把数据返回给前台
> //       response.end()
> //     }
> //   })
> // }
> 
> // 监听1234这个端口号
> http.createServer(server).listen(1234)
> ```

## 二、 文件的存和取 - fs
> **需要使用npm安装的模块**  
> * 无   

> ### 代码   
> ```
> let fs = require('fs') // 引入文件功能
> 
> // 写入文件
> fs.writeFile('./file.txt', '这里是文件内的内容', function(err) {
>   if (err) {
>     console.log('写入失败', err)
>     return
>   }
>   console.log('写入成功')
> })
> 
> // 读取文件
> // fs.readFile('./file.txt', 'utf-8', function(err, data) {
> //   if (err) {
> //     console.log('读取失败', err)
> //     return
> //   }
> //   console.log('读取成功', data)
> // })
> ```

## 三、 express 框架的基本使用
> **需要使用npm安装的模块**  
> * express
> * body-parser
> * cookie-parser

> ### 代码   
> ```
> let express = require('express') // 引入express
> let server = express() // 实例化express
> let bodyParser = require('body-parser') // 中间件,用于获取 post 的传值
> let cookieParser = require('cookie-parser') // cookie 操作插件
> 
> server.listen(1234) // 监听 1234 这个端口
> // 使用中间件
> // 格式化 post 请求的入参,extended 为 false 时,值为数组或string, true为任意数据类型
> server.use(bodyParser.urlencoded({ extended: false }))
> // 使用 cookieParser
> server.use(cookieParser())
> 
> // 监听 get 请求 - 设置了接口名
> server.get('/get', (req, res, next) => {
>   let data = req.query
>   // 设置cookie
>   res.cookie(
>     'account', // cookie名
>     123, // cookie内容
>     {
>       path: '/get', // cookie 生效的路径
>       maxAge: 10000 // 过期时间
>     }
>   )
>   res.paramsData = {
>     params: data,
>     a: '有人get了'
>   }
>   next()
> })
> 
> // 监听 post 请求 - 设置了接口名
> server.post('/post', (req, res, next) => {
>   let data = req.body
>   res.paramsData = {
>     params: data,
>     a: '有人post了'
>   }
>   next()
> })
> 
> // 可同时监听 get 和 post 请求
> server.use('*', (req, res, next) => {
>   res.setHeader("Access-Control-Allow-Origin", "*")
>   if (res.paramsData) {
>     console.log(res.paramsData.a, res.paramsData.params)
>     res.send(JSON.stringify(res.paramsData.params)) // 发送返回值并结束请求
>     return
>   }
>   res.send('发起了请求') // 发送返回值并结束请求
> })
> ```

## 四、 mysql 数据库的连接与使用
> **需要使用npm安装的模块**  
> * mysql

> ### 代码
> ```
> let mysql = require('mysql') // 引入插件
> 
> // 设定连接的 mysql 库
> let pool = mysql.createPool({
>   hose: 'localhost', // 网络路径
>   port: '3306', // 端口,可不写,默认 3306
>   user: 'root', // 数据库登陆账号
>   password: '123', // 数据库登陆密码
>   database: '20180805' // 链接的库名
> })
> 
> // 创建一个连接服务
> pool.getConnection((err, connection) => {
>   if (err) {
>     console.log('连接失败:' + err)
>     connection.release()
>   }
>   else {
>     console.log('连接成功')
>     // 使用方法对数据库进行操作,使用数据库语句
>     connection.query('INSERT INTO `userTab` (`user`, `pass`) VALUES("xiaoming", "123789");', > (err, data) => {
>       if (err) console.log('操作失败:' + err)
>       else console.log('操作成功')
>       // 由于数据库设置的同时连接数量有限,用完之后,需要及时关闭这个连接
>       connection.release()
>     })
>   }
> })
> ```