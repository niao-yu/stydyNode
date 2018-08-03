let mysql = require('mysql')
let http = require('http')

let pool = mysql.createPool({
  hose: 'localhost',
  user: 'root',
  password: '123',
  database: '20180805',
  port: '3306'
})

let server = function(request, response) {
  console.log('调用')
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('1连接失败:' + err)
      connection.release()
    }
    else {
      console.log('1连接成功')
      connection.query('INSERT INTO `userTab` (`user`, `pass`) VALUES("xiaoming", "123789");', (err, data) => {
        if (err) {
          console.log('2连接失败:' + err)
          connection.release()
        }
        else {
          console.log('2连接成功')
          response.end(JSON.stringify(data))
          connection.release()
        }
      })
    }
  })
}
http.createServer(server).listen(1234)
