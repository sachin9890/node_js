var data={
    mouse_x:e.layerX,
    mouse_y:e.layerY,
    context:e.target.id,
}

var socket = io();

socket.on('chat message', function(msg){
       // $('#messages').append($('<li>').text(msg));
       
      });