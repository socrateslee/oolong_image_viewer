function ImageViewer(img){
    this.startDrag = function(e){
        if (!e) {
            var e = window.event;
        }
		if (e.target.tagName != 'IMG') return;
        offsetX = e.clientX;
        offsetY = e.clientY;

        if(!e.target.style.left) e.target.style.left='0px';
        if(!e.target.style.top) e.target.style.top='0px';

        var coordX = parseInt(e.target.style.left);
        var coordY = parseInt(e.target.style.top);

		img.style.cursor = "-webkit-grabbing";
        document.onmousemove = function(e){
            if (!e) {var e= window.event};
            e.target.style.left = coordX + e.clientX - offsetX + 'px';
            e.target.style.top = coordY + e.clientY - offsetY + 'px';
            return false;
        };
        return false;
    }

    this.stopDrag = function(){
		img.style.cursor = "-webkit-grab";
        document.onmousemove = null;
    }

    this.enable = function(){
        document.onmousedown = this.startDrag;
        document.onmouseup = this.stopDrag;
    }

    this.disable = function(){
        document.onmousedown = null;
        document.onmouseup = null;
    }

	this.zoomin = function(){
		img.width = parseInt(img.width * 1.25);
		img.height = parseInt(img.height * 1.25);
	}

	this.zoomout = function(){
		img.width = parseInt(img.width * 0.8);
		img.height = parseInt(img.height * 0.8);
	}

	this.original = function(fitWindow){
    if(img.naturalWidth < window.innerWidth || fitWindow != true){
		    img.width = img.naturalWidth;
		    img.height = img.naturalHeight;
    }
    else{
        img.width = window.innerWidth * 0.8;
        img.height = img.naturalHeight * window.innerWidth * 0.8 / img.naturalWidth
    }
	}
    var _this = this;
	this.init = function(){
		var newNode = document.createElement("span");
		newNode.className = "image-viewer-fixed-element";
		newNode.innerHTML = '<div class="btn-group">'
		    + '<button class="btn btn-default" id="image-viewer-zoomin"><span class="glyphicon glyphicon-zoom-in"></span></button>'
			+ '<button class="btn btn-default" id="image-viewer-zoomout"><span class="glyphicon glyphicon-zoom-out"></span></button>'
			+ '<button class="btn btn-default" id="image-viewer-original"><span class="glyphicon glyphicon-picture"></span></button>'
			+ '</div>';
		document.body.insertBefore(newNode, img)
		document.getElementById("image-viewer-zoomin").onclick = this.zoomin;
		document.getElementById("image-viewer-zoomout").onclick = this.zoomout;
		document.getElementById("image-viewer-original").onclick = this.original;
        // capture `ctrl + mousewheel` event
        window.addEventListener('mousewheel', function(e) {
            if (e.ctrlKey) {
                if (e.wheelDelta > 0) {
                    _this.zoomin();
                } else {
                    _this.zoomout();
                }
                e.preventDefault();
            }
        });
        // capture `ctrl + 0` keypress event
        window.addEventListener('keydown', function(e) {
            if (e.keyCode === 48 && e.ctrlKey) {
                _this.original();
                e.preventDefault();
            }
        })
		img.style.position = "relative";
		img.style.cursor = "-webkit-grab";
		img.style.left = "50px";
		img.style.top = "50px";
		this.original(true);
		this.enable();
	}
}

(function(){
	var defaultImg = document.getElementsByTagName('img')[0];
  var newImg = document.createElement('img');
  var parent = defaultImg.parentElement;
  parent.removeChild(defaultImg);
  parent.insertBefore(newImg, null);
	newImg.onload = function(){
    var imageViewer = new ImageViewer(newImg);
	   imageViewer.init();
  }
  newImg.src = defaultImg.src;
})();
