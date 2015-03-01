$(function() {
    var canvas, ctx, C_width, C_height;
    var data, flag = false;
    var w = $(window).width();
    var h = $(window).height();
    var color = "blue";
    var mouseData = {};
    var pgnum = 3;

    var socket = io.connect();
    var last;
    var last_flag = false;
    var flip_book = $("#flipbook");
   

    flip_book.turn({
        width: w - (w / 10),
        height: h - (h / 8),
        autoCenter: true,
        when: {
            turned: function(event, page, pageObj) {
                var canvases = document.getElementsByTagName('canvas')
                for (var i = 0; i < canvases.length; i++) {
                    canvases[i].addEventListener('mousedown', mouse_down);
                }
            }
        }
    });

    flip_book.turn("page", 3);



    flip_book.on("turning", function(event, page, pageObj) {
        //pgnum=page;
    });

    flip_book.turn("disable", true);

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
        flip_book.turn("disable", true);
    }


    function mouse_down(e) {
        
        if(!$(this).attr('width'))
           {
                $(this).attr("width", C_width);
                $(this).attr("height", C_height);
            }
        
        if (mouseData.eraser_flag) {
            mouseData = {
                mouse_x: e.layerX,
                mouse_y: e.layerY,
                target: e.target.id,
                eraser_flag: true,
                
            }
        }
        else {
            mouseData = {
                mouse_x: e.layerX,
                mouse_y: e.layerY,
                target: e.target.id,
                eraser_flag: false,
                
            }
        }

       canvas = document.getElementById(mouseData.target);
        ctx = canvas.getContext('2d');
        ctx.font = "30px Arial";
        ctx.fillText("Draw", 50, 80);
        if (mouseData.eraser_flag) {

        }
        else {
            ctx.beginPath();
            ctx.moveTo(mouseData.mouse_x, mouseData.mouse_y);
            ctx.lineWidth = 3;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.strokeStyle = color;
        }

        socket.emit('sendData', mouseData);
        canvas.addEventListener('mousemove', function(e) {
            data=mouseData;
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
            ctx.clearRect(data.mouse_x, data.mouse_y, 32, 32);
            socket.emit('Draw', data);
        }
        else {
            ctx.lineTo(data.mouse_x, data.mouse_y);
            ctx.stroke();
            ctx.save();
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

    $("#pen").on('click', function() {
        mouseData.eraser_flag = false;
        $('canvas').removeClass('eraser');
        $('canvas').addClass('pen');
        socket.emit('pen', mouseData);
    });

    $("#eraser").on('click', function() {
        mouseData.eraser_flag = true;
        $('canvas').removeClass('pen');
        $('canvas').addClass('eraser');
        socket.emit('eraser', mouseData);
    });

    $('#clr').on('blur', function() {
        color = "#" + $(this).val();
        socket.emit('ChangeColor', color);

    });


    socket.on('pen', function(_erdata) {
        mouseData.eraser_flag = _erdata.eraser_flag;
        $('canvas').removeClass('eraser');
        $('canvas').addClass('pen');
    });

    socket.on('eraser', function(_erdata) {
        mouseData.eraser_flag = _erdata.eraser_flag;
        $('canvas').removeClass('pen');
        $('canvas').addClass('eraser');
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
        if (data.eraser_flag) {
            ctx.clearRect(data.mouse_x, data.mouse_y, 20, 20);
        }
        else {
            ctx.lineTo(data.mouse_x, data.mouse_y);
            ctx.stroke();
        }


    });

    socket.on('sendData', function(_data) {
        data = _data;
        
        canvas = document.getElementById(_data.target);
         var ref = canvas.hasAttribute("width");
        if(!ref)
           {
                $(canvas).attr("width", C_width);
                $(canvas).attr("height", C_height);
            }
        
        ctx = canvas.getContext('2d');
        ctx.font = "30px Arial";
        ctx.fillText("Draw", 50, 80);
       
        if (mouseData.eraser_flag) {

        }
        else {
            ctx.beginPath();
            ctx.moveTo(data.mouse_x, data.mouse_y);
            ctx.lineWidth = 3;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.strokeStyle = color;
        }

    });

});