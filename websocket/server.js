const express = require('express')
const app = express()

//设置静态文件夹
app.use(express.static(__dirname))

//监听3000端口
app.listen(3022)

//===============================================
//开始创建一个websocket服务
const Server = require('ws').Server

//这里设置服务器的端口号,和上面的3000端口不一致

const ws = new Server({ port: 9999 })

//监听服务端和客户端的连接情况
ws.on('connection', function(socket) {
  //监听客户端发来的信息
  socket.on('message', function(msg) {
    console.log(msg) //这个就是客户端发来的信息

    //服务端发信息给客户端
    socket.send(`这里是服务端对你说的话:${msg}`)
  })
})
