var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var os=require("os");


server.listen(8080,function(){
    console.log('server start....')
});

var numUsers = 0;
io.on('connection', function (socket) {
    var addedUser = false;
    //获取IP地址
    var networkInterfaces=os.networkInterfaces();
    var ip = networkInterfaces['en0'][1].address;
    
  socket.emit('connection', { msg: '服务器连接成功!',ip:ip });
  socket.on('login', function (data) {
    ++numUsers;
    console.log(">>>>>玩家登陆:",data,"id:",socket.id);
    data.id = socket.id;
    data.numUsers = numUsers;
    socket.broadcast.emit('someone-online', data);
  });

  socket.on('go-go',function(data){
    console.log('go-go-go',data)
    socket.broadcast.emit('player-go',data)
  })

  socket.on('go-vertical',function(data){
    console.log('go-vertical',data)
    socket.broadcast.emit('go-vertical',data)
  })

  //用户离开或掉线
  socket.on('disconnect', function () {
        --numUsers;
        console.log(">>>>>玩家离线：",socket.id)
        socket.broadcast.emit('player-left', {
            username: socket.username,
            numUsers: numUsers,
            pid:socket.id
        });
        
  });

});
