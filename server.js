var express = require('express');
var app = express();
var server = app.listen(3000);
console.log('Listening on port 3000');
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/webapp'));

io.on('connection', function(socket) {
    console.log("connected...");
    socket.on("sendData", function(data) {
        socket.broadcast.emit('sendData', data);
    });

    socket.on("Draw", function(data) {
        socket.broadcast.emit('Draw', data);
    });


    socket.on("ChangeColor", function(data) {
        socket.broadcast.emit('ChangeColor', data);
    });

    socket.on("FirstPage", function(data) {
        socket.broadcast.emit('FirstPage', data);
    });

    socket.on("NextPage", function(data) {
        socket.broadcast.emit('NextPage', data);
    });

    socket.on("PrevPage", function(data) {
        socket.broadcast.emit('PrevPage', data);
    });

    socket.on("LastPage", function(data) {
        socket.broadcast.emit('LastPage', data);
    });

    socket.on("eraser", function(data) {
        socket.broadcast.emit('eraser', data);
    });

    socket.on("pen", function(data) {
        socket.broadcast.emit('pen', data);
    });
});
