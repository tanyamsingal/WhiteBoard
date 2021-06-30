var mode = 'pen';
var board = document.getElementById('board')
function handleModeChange(newMode) {
    var currentElement = document.getElementById(newMode);
    currentElement.classList.toggle('active');
    var oldElement = document.getElementById(mode);
    var newClass = oldElement.className.replace(' active', '');
    oldElement.className = newClass;
    if (newMode == 'image') {
        var imageOptions = document.getElementById('imageOptions');
        imageOptions.classList.toggle('show');
    }
    if (mode == newMode) {
        if (mode == 'pen') {
            var penOptions = document.getElementById('penOptions');
            penOptions.classList.toggle('show');
        }
    }
    // else if(mode =='image' && newMode=='pen'){
    //     var board = document.getElementById('board');
    //     board.style.zIndex=1;
    //     var imgs = document.getElementsByClassName('img');
    //     for(var i=0;i<imgs.length;i++){
    //         imgs[i].style.zIndex=-1;
    //     }
    //     mode ='pen';
    // }
    else
        mode = newMode;
}

function changePenSize(newSize) {

    var oldid = 'penSpan' + penSize;
    oldSize = document.getElementsByClassName(oldid)[0];
    oldSize.classList.toggle('active');

    var newid = 'penSpan' + newSize
    selectedSize = document.getElementsByClassName(newid)[0];
    selectedSize.classList.toggle('active');

    penSize = newSize;
}

function changePenColor(newColor) {
    switch (newColor) {
        case 'black':
            penColor = '#000000';
            break;

        case 'red':
            penColor = '#ff0000';
            break;

        case 'blue':
            penColor = '#0000ff';
            break;

    }
    var penSpan = document.getElementById('pen');
    penSpan.src = '../icons/pencil_icon_dark.png';
    penSpan.style.backgroundColor = penColor;
}

function handleZoom() {
    // console.log('zoom clicked');
    var zoom = document.getElementById('zoomOptions');
    zoom.classList.toggle('show');
}

function handleZoomChange() {
    var zoomRangeElement = document.getElementById('zoomRangeElement');
    var zoomLevelElement = document.getElementById('zoomLevel');
    var zoomRangeElementNumber = parseInt(zoomRangeElement.value);
    var intervalId;

    zoomLevelElement.innerText = zoomRangeElement.value + 'x';
    if (canvasZoom < zoomRangeElementNumber) {
        canvasZoom = 2 * (zoomRangeElementNumber - canvasZoom);
        // canvasZoom = parseInt(zoomRangeElement.value)/2;
        ctx.scale(canvasZoom, canvasZoom);
        redrawAll();
    }
    else if (canvasZoom > zoomRangeElementNumber) {
        var multiplier = (canvasZoom / 2) / 0.5;
        for (var i = 0; i < multiplier / 2; i++) {
            ctx.scale(0.5, 0.5);
        }
        redrawAll();
    }
}

function downloadCanvas() {
    var button = document.getElementById('downloadButton');
    var dataURL = board.toDataURL('image/png');
    button.href = dataURL;
    button.download='mycanvas.jpg';
}