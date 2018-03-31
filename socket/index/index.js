var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.emit('some event', {for : 'everyone'});

io.on('connection', function(socket){
    socket.broadcast.emit('hi');
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});




http.listen(3002, function(){
    console.log('Listening on *:3002');
});

