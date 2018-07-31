let express = require('express')
let server = express()

server.listen(1234)
server.get('', (req, res) => {
  console.log('有人get了')
  res.write('a')
  res.end()
})