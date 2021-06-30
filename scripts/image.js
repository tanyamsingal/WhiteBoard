var imageCounter = 0;
function uploadImage() {
    var image = document.getElementsByClassName('imageInput')[0];
    if (image != null) {
        console.log(image.files);
    }
    var img = document.createElement('img');
    var imgDiv = document.createElement('div');
    imgDiv.id = 'imgdiv'+imageCounter;
    imgDiv.style.position = 'absolute';
    img.src = window.URL.createObjectURL(image.files[0]);
    img.id = 'image' + imageCounter;
    img.classList.add('img');
    imgDiv.appendChild(img);

    var crossIcon = document.createElement('img');
    crossIcon.src = '../icons/cross_icon_dark.png'; 
    crossIcon.id = 'cross' + imageCounter;
    var board = document.getElementById('board');
    // board.style.zIndex=-1;
    // crossIcon.style.zIndex=1;
    crossIcon.onclick = deleteImage;
    imgDiv.appendChild(crossIcon);


    img.style.height=200+'px';
    img.style.width=300+'px';
    // board.height = document.body.clientHeight-57;
    // board.width = document.body.clientWidth;
    document.body.appendChild(imgDiv);
}

function deleteImage(e) {
    var imgId = e.currentTarget.id;
    imgId = imgId.slice(5);
    var stickyDiv = document.getElementById('imgdiv' + imageCounter);
    document.body.removeChild(stickyDiv);
}