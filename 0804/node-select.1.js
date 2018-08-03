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
  pool.getConnection((err, connection) => {
    if (err) console.log('连接失败:' + err)
    else {
      connection.query('SELECT * FROM `userTab`;', (err, data) => {
        if (err) console.log('连接失败:' + err)
        else {
          response.end(JSON.stringify(data))
          connection.end()
        }
      })
    }
  })
}
http.createServer(server).listen(1234)
