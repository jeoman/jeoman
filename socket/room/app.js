var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.sockets.on('connection', function(socket){
    socket.emit('connetion', {
        type : 'connected'
    });

    socket.on('connection', function(data){
        if(data.type == 'join'){
            socket.join(data.room);
            socket.set('room', data.room);
            socket.emit('system', {
                message : '채팅방에 오신 것을 환영합니다.'
            });
            socket.boroadcast.to(data.room).emit('system', {
                message : data.name + '님이 접속하셨습니다.'
            });
        }
    });

    socket.on('user', function(data){
        socket.get('room', function(error, room){
            socket.boroadcast.to(room).emit('message', data);
        });
    });
});

http.listen(3002, function(){
    console.log('Listening on *:3002');
});
