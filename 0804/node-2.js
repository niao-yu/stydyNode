let http = require('http')
let mysql = require('mysql')

let pool = mysql.createPool({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '123',
  database: '20180805'
})

let server = (request, response) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log('连接失败:' + err)
      return
    } else {
      connection.query('SELECT * FROM `userTab`;', (err, data) => {
        if (err) {
          console.log('SELECT 失败:' + err)
          connection.release()
          return
        } else {
          response.end(JSON.stringify(data))
          connection.release()
        }
      })
    }
  })
}

http.createServer(server).listen(1234)