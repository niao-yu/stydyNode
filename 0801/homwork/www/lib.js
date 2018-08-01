(function() {
  // ajax封装
  (function() {
    console.log(232)
    let server = new XMLHttpRequest()
    window.ajax = function(obj) {
      // 数据处理
      let sendData = ''
      for (let k in obj.data) {
        sendData += k + '=' + obj.data[k] + '&'
      }
      sendData = sendData.substring(0, sendData.length - 1)
      if (obj.type === 'get') { // get请求方式
        server.open(obj.type, obj.url + '?' + sendData, true)
        server.send()
      } else if (obj.type === 'post') { // post请求
        // 请求头
        server.open(obj.type, obj.url, true)
        server.setRequestHeader('CONTENT-TYPE', 'application/x-www-form-urlencoded')
        server.send(sendData)
      }
      server.onreadystatechange = function() {
        if (server.readyState != 4) return
        if (server.status == 200) {
          obj.success(JSON.parse(server.responseText))
        } else {
          if (obj.error) obj.error(server.responseText)
          else console.log('服务器错误：' + server.responseText)
        }
      }
    }
  })()
  
})()