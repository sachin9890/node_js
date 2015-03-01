var express = require('express');
//var fs = require('fs');
//var path = require('path');
//var url = require('url');
//var bodyParser = require('body-parser')
var app = express();
//app.use(bodyParser());


var server = app.listen(3000);
console.log('Listening on port 3000...');
var io = require('socket.io').listen(server);


app.use(express.static(__dirname + '/webapp'));



io.on('connection', function(socket) {
    console.log("connected...");
    socket.on("sendData", function(data) {
        console.log(data);
        io.sockets.emit('sendData', data);


    });


    socket.on("Draw", function(data) {
        console.log(data);

        console.log('draw got');

        socket.broadcast.emit('Draw', data);
    });


    socket.on("ChangeColor", function(data) {

        socket.broadcast.emit('ChangeColor', data);
    });

    socket.on("FirstPage", function(data) {
        console.log("FirstPage");
        socket.broadcast.emit('FirstPage', data);
    });

    socket.on("NextPage", function(data) {
        console.log("NextPage");
        socket.broadcast.emit('NextPage', data);
    });

    socket.on("PrevPage", function(data) {
        console.log("PrevPage");
        socket.broadcast.emit('PrevPage', data);
    });

    socket.on("LastPage", function(data) {
        console.log("LastPage");
        socket.broadcast.emit('LastPage', data);
    });

    socket.on("eraser", function(data) {
        socket.broadcast.emit('eraser', data);
    });
});