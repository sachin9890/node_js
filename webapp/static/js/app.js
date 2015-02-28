$(function() {
    var canvas, ctx, C_width, C_height;
    var data, flag = false;
    var w = $(window).width();
    var h = $(window).height();
    var color = "blue";
    var mouseData = {};
    var pgnum = 3;
    var opt = {
        host: "192.168.0.109",
        hostname: "192.168.0.109",
        path: "../socket.io",
        port: "3000",
        secure: false
    }
    var socket = io.connect('http://192.168.0.109:3000/');
    var last;
    var last_flag = false;
    var flip_book = $("#flipbook");
    console.log(socket);

    flip_book.turn({
        width: w - 160,
        height: h - 80,
        autoCenter: true,
        when: {
            turned: function(event, page, pageObj) {
                //$('canvas').off('mousedown');
                var canvases = document.getElementsByTagName('canvas')
                for (var i = 0; i < canvases.length; i++) {
                    canvases[i].addEventListener('mousedown', mouse_down);
                }
                // $("canvas").attr("width", C_width);
                //$("canvas").attr("height", C_height);
            }
        }
    });

    flip_book.turn("page", 3);



    flip_book.on("turning", function(event, page, pageObj) {
        //pgnum=page;
    });

    flip_book.turn("disable", true);

    $("canvas").attr({
        width: $("#page2").width(),
        height: $("#page2").height()
    });

    C_width = $("#page2").width();
    C_height = $("#page2").height();



    flip_book.bind("last", addPage);

    function addPage() {
        flip_book.turn("disable", false);
        var element = $("<canvas></canvas>", {
            id: "page" + flip_book.turn("pages")
        });
        flip_book.turn("addPage", element, $("#flipbook").turn("pages") + 1);
        flip_book.turn("next");
        $("canvas").attr("width", C_width);
        $("canvas").attr("height", C_height);
        flip_book.turn("disable", true);
    }


    function mouse_down(e) {
        console.log(e.layerX);
        if (mouseData.eraser_flag) {
            mouseData = {
                mouse_x: e.layerX,
                mouse_y: e.layerY,
                target: e.target.id,
                eraser_flag: true
            }
        } else {
            mouseData = {
                mouse_x: e.layerX,
                mouse_y: e.layerY,
                target: e.target.id,
                eraser_flag: false
            }
        }


        console.log(mouseData);

        socket.emit('sendData', mouseData);
        canvas = document.getElementById(mouseData.target);
        canvas.addEventListener('mousemove', function(e) {
            var mousePos = {
                'x': e.layerX,
                'y': e.layerY
            };
            data.mouse_x = mousePos.x;
            data.mouse_y = mousePos.y;

        }, false);
        canvas.addEventListener('mousemove', onPaint, false);
        canvas.addEventListener('mouseup', function() {
            canvas.removeEventListener('mousemove', onPaint, false);

        }, false);
    }

    var onPaint = function() {
        if (mouseData.eraser_flag) {
            ctx.clearRect(data.mouse_x, data.mouse_y, 20, 20);
            socket.emit('Draw', data);
        } else {
            console.log("mouse move");
            console.log(data.mouse_x)
            ctx.lineTo(data.mouse_x, data.mouse_y);
            ctx.stroke();
            socket.emit('Draw', data);
        }


    };


    $("#first").on('click', function() {
        pgnum = 3;
        flip_book.turn("disable", false);
        flip_book.turn("page", 3);
        socket.emit('FirstPage', 3);
        flip_book.turn("disable", true);
    });

    $("#next").on('click', function() {
        pgnum += 1;
        flip_book.turn("disable", false);
        flip_book.turn("next");
        socket.emit('NextPage', pgnum);
        flip_book.turn("disable", true);
    });


    $("#prev").on('click', function() {
        flip_book.turn("disable", false);
        pgnum -= 1;
        flip_book.turn("previous");
        socket.emit('PrevPage', pgnum);
        flip_book.turn("disable", true);
    });

    $("#last").on('click', function() {
        flip_book.turn("disable", false);
        last = flip_book.turn('pages');
        pgnum = last;
        flip_book.turn("page", last);
        socket.emit('LastPage', last);
        flip_book.turn("disable", true);
    });

    $("#eraser").on('click', function() {
        mouseData.eraser_flag = true;
        socket.emit('eraser', mouseData);
    });

    $('#clr').on('blur', function() {
        color = "#" + $(this).val();

        socket.emit('ChangeColor', color);

    });

    socket.on('eraser', function(_erdata) {
        mouseData.eraser_flag = _erdata.eraser_flag;
        console.log("eraser,.....")
    });


    socket.on('ChangeColor', function(_color) {
        color = _color;
        $('#clr').val(color).css('background-color', color);

    });

    socket.on('FirstPage', function(_pg) {
        flip_book.turn("disable", false);
        flip_book.turn("page", 3);
        flip_book.turn("disable", true);
    });

    socket.on('NextPage', function(_pg) {
        flip_book.turn("disable", false);
        flip_book.turn("next");
        flip_book.turn("disable", true);
    });

    socket.on('PrevPage', function(_pg) {
        flip_book.turn("disable", false);
        flip_book.turn("previous");
        flip_book.turn("disable", true);
    });

    socket.on('LastPage', function(_pg) {
        flip_book.turn("disable", false);
        flip_book.turn("page", _pg);
        flip_book.turn("disable", true);
    });

    socket.on('Draw', function(_data) {
        var data = _data;
        if(data.eraser_flag)
        {
          ctx.clearRect(data.mouse_x, data.mouse_y, 20, 20);
        }
        else{
        console.log("mouse move");
        console.log(data.mouse_x)
        ctx.lineTo(data.mouse_x, data.mouse_y);
        ctx.stroke();
        }
        

    });

    socket.on('sendData', function(_data) {
        console.log("data");
        data = _data;
        console.log(data);
        canvas = document.getElementById(_data.target);
        ctx = canvas.getContext('2d');
        ctx.font = "30px Arial";
        ctx.fillText("Draw", 50, 80);
        if (mouseData.eraser_flag) {

        } else {
            ctx.beginPath();
            ctx.moveTo(data.mouse_x, data.mouse_y);
            //mouseData.down_flag=false;

            /* Mouse Capturing Work */

            ctx.lineWidth = 3;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.strokeStyle = color;
        }

    });

});