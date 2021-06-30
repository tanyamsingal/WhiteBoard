(function () {
    var board = document.getElementById("board");
    ctx = board.getContext('2d');
    var isDrawing = false;
    var isErasing = false;
    var isStickyMoving = false;
    var movingStickyDiv;
    var location;
    penSize = 2;
    var stickyCounter = 0;
    penColor = '#000000';
    var redoStack = [];
    points = [];
    var undo = document.getElementById('undoButton');
    var redo = document.getElementById('redoButton');
    var zoom = document.getElementById('zoomButton');
    canvasZoom = 1;


    init();
    function init() {
        // var rect = board.getBoundingClientRect();
        // board.height = rect.height;
        // board.width = rect.width;

        window.addEventListener('resize', onResize, false);
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = penSize;
    }



    var onMouseDown = function () {
        location = getLocation();
        if (mode == 'pen') {
            isDrawing = true;
            ctx.lineWidth = penSize;
            ctx.strokeStyle = penColor;
            ctx.globalCompositeOperation = 'source-over';
            points.push({
                x: location.x,
                y: location.y,
                size: penSize,
                color: penColor,
                mode: 'begin'
            });
        }
        if (mode == 'eraser') {
            isErasing = true;
            ctx.lineWidth = 30;
            ctx.globalCompositeOperation = 'destination-out';
        }

        if (mode == 'sticky') {
            location = getLocation();
            var stickydiv = document.createElement('div');
            stickydiv.id = 'sticky' + stickyCounter;
            stickydiv.className = 'sticky';

            var dragIcon = document.createElement('img');
            dragIcon.id = 'drag' + stickyCounter;
            dragIcon.style.height = '20px';
            dragIcon.style.width = '20px';
            dragIcon.onmousedown = dragMouseDown;
            dragIcon.src = '../icons/move_icon_dark.png';

            var crossIcon = document.createElement('img');
            crossIcon.id = 'cross' + stickyCounter;
            crossIcon.style.height = '20px';
            crossIcon.style.width = '20px';
            crossIcon.onclick = deleteSticky;
            crossIcon.src = '../icons/cross_icon_dark.png';

            var sticky = document.createElement("textarea");
            sticky.className = 'textarea';
            sticky.placeholder = 'Your text here...';

            stickydiv.appendChild(crossIcon);
            stickydiv.appendChild(dragIcon);
            stickydiv.appendChild(sticky);
            stickydiv.style.position = 'absolute';
            stickydiv.style.left = location.x - 45 + 'px';
            stickydiv.style.top = location.y + 50 + 'px';
            document.body.appendChild(stickydiv);
            stickyCounter++;
        }

        ctx.imageSmoothingQuality = 'high';
        ctx.moveTo(location.x, location.y);
    };

    var onMouseMove = function () {
        if (isErasing == false || mode != 'eraser') {
            if (isDrawing == false || mode != 'pen') {
                if (isStickyMoving == false || mode != 'sticky') {
                    return;
                }
            }
        }
        if (isErasing == true && mode == 'eraser') {
            ctx.beginPath();
            ctx.moveTo(location.x, location.y);
            ctx.fillStyle = 'white';
            // ctx.arc(location.x, location.y, 30, 0, 2 * Math.PI);
            ctx.fill();
            location = getLocation();
            ctx.lineTo(location.x, location.y);
            ctx.stroke();
        }
        if (isDrawing == true && mode == 'pen') {
            ctx.beginPath();
            ctx.moveTo(location.x, location.y);
            location = getLocation();
            ctx.lineTo(location.x, location.y);
            ctx.stroke();
            points.push({
                x: location.x,
                y: location.y,
                size: penSize,
                color: penColor,
                mode: 'draw'
            });
            ctx.closePath();
        }
        if (isStickyMoving == true && mode == 'sticky') {
            location = getLocation();
            movingStickyDiv.style.left = location.x + 'px';
            movingStickyDiv.style.top = location.y + 40 + 'px';
        }
    };

    var onMouseUp = function () {
        if (isDrawing) {
            points.push({
                x: location.x,
                y: location.y,
                size: penSize,
                color: penColor,
                mode: 'end'
            });
        }
        isDrawing = false;
        isErasing = false;
        isStickyMoving = false;
    };

    var getLocation = function () {
        var rect = board.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };

    board.addEventListener("mousedown", onMouseDown);
    board.addEventListener("mousemove", onMouseMove);
    board.addEventListener("mouseup", onMouseUp);
    document.addEventListener('keydown', onKeyDown);

    function dragMouseDown(e) {
        isStickyMoving = true;
        var imgId = e.currentTarget.id;
        imgId = imgId.slice(4);
        movingStickyDiv = document.getElementById('sticky' + imgId);
    }

    function deleteSticky(e) {
        var imgId = e.currentTarget.id;
        imgId = imgId.slice(5);
        var stickyDiv = document.getElementById('sticky' + imgId);
        document.body.removeChild(stickyDiv);
    }

    function onKeyDown(e) {
        if (mode == 'sticky') {
            if (e.key === 'Escape') {
                isStickyMoving = false;
            }
        }
        else {
            switch (e.key) {
                case 'p':
                    {
                        var oldElement = document.getElementById(mode);
                        oldElement.classList.toggle('active');
                        mode = 'pen';
                        var penElement = document.getElementById('pen');
                        penElement.classList.toggle('active');
                        break;
                    }
                case 'e': {
                    var oldElement = document.getElementById(mode);
                    oldElement.classList.toggle('active');
                    mode = 'eraser';
                    var eraserElement = document.getElementById('eraser');
                    eraserElement.classList.toggle('active');
                    break;
                }
                case 'i': {
                    var oldElement = document.getElementById(mode);
                    oldElement.classList.toggle('active');
                    mode = 'image';
                    var imageElement = document.getElementById('image');
                    imageElement.classList.toggle('active');
                    var imageOptions = document.getElementById('imageOptions');
                    imageOptions.classList.toggle('show');
                    break;
                }
                case 's': {
                    var oldElement = document.getElementById(mode);
                    oldElement.classList.toggle('active');
                    mode = 'sticky';
                    var stickyElement = document.getElementById('sticky');
                    stickyElement.classList.toggle('active');
                    break;
                }
            }
        }
    }

    var undoLast = function () {
        var pointsPop = points.pop();
        if (pointsPop != undefined) {
            redoStack.push(pointsPop);
            redrawAll();
        }
    }

    var redoLast = function () {
        var redoStackPop = redoStack.pop();
        if (redoStackPop != undefined) {
            points.push(redoStackPop);
            redrawAll();
        }
    }

    function onResize() {
        board.width = window.innerWidth - 5;
        board.height = window.innerHeight - 60;
        redrawAll();
    }

    redrawAll = function () {
        if (points.length == 0) {
            return;
        }
        ctx.clearRect(0, 0, board.width, board.height);

        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            var begin = false;

            if (ctx.lineWidth != point.size) {
                ctx.lineWidth = point.size;
                begin = true;
            }
            if (ctx.strokeStyle != point.color) {
                ctx.strokeStyle = point.color;
                begin = true;
            }
            if (point.mode == "begin" || begin) {
                ctx.beginPath();
                ctx.moveTo(point.x, point.y);
            }
            ctx.lineTo(point.x, point.y);
            if (point.mode == "end" || (i == points.length - 1)) {
                ctx.stroke();
            }
        }
        ctx.stroke();
    }
    var interval;
    undo.addEventListener('mousedown', function () {
        interval = setInterval(undoLast, 50);
    });
    undo.addEventListener('mouseup', function () {
        clearInterval(interval);
    });
    redo.addEventListener('mousedown', function () {
        interval = setInterval(redoLast, 50);
    });
    redo.addEventListener('mouseup', function () {
        clearInterval(interval);
    });

    // var zoom = function (clicks) {
    //     var pt = ctx.transformedPoint(lastX, lastY);
    //     ctx.translate(pt.x, pt.y);
    //     var factor = Math.pow(scaleFactor, clicks);
    //     ctx.scale(factor, factor);
    //     ctx.translate(-pt.x, -pt.y);
    //     redrawAll();
    // }
    onResize();

})();