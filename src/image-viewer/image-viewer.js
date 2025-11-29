function ImageViewer(img){
    var isSVG = img.tagName === 'SVG' || img.tagName === 'svg';

    this.startDrag = function(e){
        if (!e) {
            var e = window.event;
        }
		// For SVG, the target might be a child element, so check if it's within the img element
		var targetElement = e.target;
		var isValidTarget = false;

		if (isSVG) {
			// For SVG, check if target is the SVG itself or a child of it
			isValidTarget = (targetElement === img || img.contains(targetElement));
		} else {
			// For IMG, check if target is the image
			isValidTarget = (targetElement.tagName === 'IMG');
		}

		if (!isValidTarget) return;

        offsetX = e.clientX;
        offsetY = e.clientY;

        if(!img.style.left) img.style.left='0px';
        if(!img.style.top) img.style.top='0px';

        var coordX = parseInt(img.style.left);
        var coordY = parseInt(img.style.top);

		img.style.cursor = "-webkit-grabbing";
        document.onmousemove = function(e){
            if (!e) {var e= window.event};
            img.style.left = coordX + e.clientX - offsetX + 'px';
            img.style.top = coordY + e.clientY - offsetY + 'px';
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
		if (isSVG) {
			var currentWidth = img.clientWidth || parseInt(img.getAttribute('width')) || 300;
			var currentHeight = img.clientHeight || parseInt(img.getAttribute('height')) || 300;
			img.setAttribute('width', parseInt(currentWidth * 1.25));
			img.setAttribute('height', parseInt(currentHeight * 1.25));
		} else {
			img.width = parseInt(img.width * 1.25);
			img.height = parseInt(img.height * 1.25);
		}
	}

	this.zoomout = function(){
		if (isSVG) {
			var currentWidth = img.clientWidth || parseInt(img.getAttribute('width')) || 300;
			var currentHeight = img.clientHeight || parseInt(img.getAttribute('height')) || 300;
			img.setAttribute('width', parseInt(currentWidth * 0.8));
			img.setAttribute('height', parseInt(currentHeight * 0.8));
		} else {
			img.width = parseInt(img.width * 0.8);
			img.height = parseInt(img.height * 0.8);
		}
	}

	this.original = function(fitWindow){
		if (isSVG) {
			var originalWidth, originalHeight;

			// Try to get dimensions from viewBox first
			if (img.viewBox && img.viewBox.baseVal && img.viewBox.baseVal.width > 0) {
				originalWidth = img.viewBox.baseVal.width;
				originalHeight = img.viewBox.baseVal.height;
			} else {
				// Fallback to width/height attributes or computed size
				originalWidth = parseInt(img.getAttribute('width')) || img.clientWidth || 300;
				originalHeight = parseInt(img.getAttribute('height')) || img.clientHeight || 300;
			}

			if(originalWidth < window.innerWidth || fitWindow != true){
				img.setAttribute('width', originalWidth);
				img.setAttribute('height', originalHeight);
			}
			else{
				img.setAttribute('width', window.innerWidth * 0.8);
				img.setAttribute('height', originalHeight * window.innerWidth * 0.8 / originalWidth);
			}
		} else {
			if(img.naturalWidth < window.innerWidth || fitWindow != true){
				img.width = img.naturalWidth;
				img.height = img.naturalHeight;
			}
			else{
				img.width = window.innerWidth * 0.8;
				img.height = img.naturalHeight * window.innerWidth * 0.8 / img.naturalWidth
			}
		}
	}
    var _this = this;
	this.init = function(){
		var newNode = document.createElementNS('http://www.w3.org/1999/xhtml', 'span');
		newNode.className = "image-viewer-fixed-element";
		newNode.innerHTML = '<div class="btn-group">'
		    + '<button class="btn btn-default" id="image-viewer-zoomin"><span class="glyphicon glyphicon-zoom-in"></span></button>'
			+ '<button class="btn btn-default" id="image-viewer-zoomout"><span class="glyphicon glyphicon-zoom-out"></span></button>'
			+ '<button class="btn btn-default" id="image-viewer-original"><span class="glyphicon glyphicon-picture"></span></button>'
			+ '</div>';
		document.body.insertBefore(newNode, img);
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
	var defaultSvg = document.getElementsByTagName('svg')[0];

	if (defaultSvg) {
		// Handle SVG element (already in proper HTML structure from loader)
		var imageViewer = new ImageViewer(defaultSvg);
		imageViewer.init();
	} else if (defaultImg) {
		// Handle IMG element
		var newImg = document.createElement('img');
		var parent = defaultImg.parentElement;
		parent.removeChild(defaultImg);
		parent.insertBefore(newImg, null);
		newImg.onload = function(){
			var imageViewer = new ImageViewer(newImg);
			imageViewer.init();
		}
		newImg.src = defaultImg.src;
	}
})();
