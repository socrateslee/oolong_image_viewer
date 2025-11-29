function ImageViewer(img, i18n){
    var isSVG = img.tagName === 'SVG' || img.tagName === 'svg';
    var _this = this;
    var offsetX, offsetY;

    this.showToast = function(message) {
        var toast = document.createElement('div');
        toast.className = 'image-viewer-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(function() {
            toast.classList.add('show');
        }, 100);
        setTimeout(function() {
            toast.classList.remove('show');
            setTimeout(function() {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 500);
        }, 3000);
    }

    this.startDrag = function(e){
        if (!e) {
            e = window.event;
        }
		var targetElement = e.target;
		var isValidTarget = false;

		if (isSVG) {
			isValidTarget = (targetElement === img || img.contains(targetElement));
		} else {
			isValidTarget = (targetElement.tagName === 'IMG');
		}

		if (!isValidTarget) return;

        offsetX = e.clientX;
        offsetY = e.clientY;

        if(!img.style.left) img.style.left='0px';
        if(!img.style.top) img.style.top='0px';

        var coordX = parseInt(img.style.left);
        var coordY = parseInt(img.style.top);

		img.style.cursor = "grabbing";
        document.onmousemove = function(e){
            if (!e) {e = window.event};
            img.style.left = coordX + e.clientX - offsetX + 'px';
            img.style.top = coordY + e.clientY - offsetY + 'px';
            return false;
        };
        return false;
    }

    this.stopDrag = function(){
		img.style.cursor = "grab";
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

	this.original = function(){
		if (isSVG || !img.naturalWidth || img.naturalWidth === 0) {
            _this.showToast("No original size found.");
		} else {
            img.width = img.naturalWidth;
            img.height = img.naturalHeight;
		}
	}

    this.fitScreen = function() {
        if (isSVG) {
            var originalWidth, originalHeight;
            if (img.viewBox && img.viewBox.baseVal && img.viewBox.baseVal.width > 0) {
                originalWidth = img.viewBox.baseVal.width;
                originalHeight = img.viewBox.baseVal.height;
            } else {
                originalWidth = parseInt(img.getAttribute('width')) || img.clientWidth || 300;
                originalHeight = parseInt(img.getAttribute('height')) || img.clientHeight || 300;
            }
             if (originalWidth > 0) {
                img.setAttribute('width', window.innerWidth * 0.9);
                img.setAttribute('height', originalHeight * window.innerWidth * 0.9 / originalWidth);
            }
        } else {
            if (img.naturalWidth > 0) {
                img.width = window.innerWidth * 0.9;
                img.height = img.naturalHeight * window.innerWidth * 0.9 / img.naturalWidth
            }
        }
        img.style.left = (window.innerWidth - img.clientWidth) / 2 + 'px';
        img.style.top = (window.innerHeight - img.clientHeight) / 2 + 'px';
    }

	this.init = function(){
        var zoomInIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2V7z"/></svg>`;
        var zoomOutIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z"/></svg>`;
        var originalSizeIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-7 7H3v4c0 1.1.9 2 2 2h4v-2H5v-4zM5 5h4V3H5c-1.1 0-2 .9-2 2v4h2V5zm14-2h-4v2h4v4h2V5c0-1.1-.9-2-2-2zm0 16h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4z"/></svg>`;
        var fitScreenIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 3h18v18H3V3zm2 2v14h14V5H5z"/><path d="M7 12h10M15 10l2 2-2 2M9 10l-2 2 2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

		var newNode = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
		newNode.className = "image-viewer-toolbar";
		newNode.innerHTML = 
			'<button id="image-viewer-zoomin">'+zoomInIcon+'</button>'
			+ '<button id="image-viewer-zoomout">'+zoomOutIcon+'</button>'
			+ '<button id="image-viewer-original">'+originalSizeIcon+'</button>'
			+ '<button id="image-viewer-fit-screen">'+fitScreenIcon+'</button>';
		document.body.appendChild(newNode);
        
        var zoomInButton = document.getElementById("image-viewer-zoomin");
        zoomInButton.title = i18n.tooltipZoomIn;
		zoomInButton.onclick = this.zoomin;

        var zoomOutButton = document.getElementById("image-viewer-zoomout");
		zoomOutButton.title = i18n.tooltipZoomOut;
        zoomOutButton.onclick = this.zoomout;

        var originalButton = document.getElementById("image-viewer-original");
		originalButton.title = i18n.tooltipOriginalSize;
        originalButton.onclick = this.original;

        var fitScreenButton = document.getElementById("image-viewer-fit-screen");
        fitScreenButton.title = i18n.tooltipFitScreen;
		fitScreenButton.onclick = this.fitScreen;

        window.addEventListener('mousewheel', function(e) {
            if (e.ctrlKey) {
                e.preventDefault();
                if (e.wheelDelta > 0) {
                    _this.zoomin();
                } else {
                    _this.zoomout();
                }
            }
        });

        window.addEventListener('keydown', function(e) {
            if (e.keyCode === 48 && e.ctrlKey) {
                _this.original();
                e.preventDefault();
            }
        })
		img.style.position = "relative";
		img.style.cursor = "grab";
		this.fitScreen(); // Initial fit when loaded
		this.enable();
	}
}

(function(){
    var scriptTag = document.getElementById('oolong-image-viewer-script');
    var i18n = scriptTag.dataset;

	var defaultImg = document.getElementsByTagName('img')[0];
	var defaultSvg = document.getElementsByTagName('svg')[0];
	var imageElement = defaultImg || defaultSvg;

	if (imageElement) {
        // Hide the original page content
        document.body.innerHTML = '';
        document.body.style.overflow = 'hidden';
        document.body.style.backgroundColor = '#222';
        
        var newImage;
        if (imageElement.tagName.toUpperCase() === 'SVG') {
            newImage = imageElement.cloneNode(true);
        } else {
            newImage = document.createElement('img');
            newImage.src = imageElement.src;
        }

        document.body.appendChild(newImage);
        
        var initViewer = function() {
            var imageViewer = new ImageViewer(newImage, i18n);
            imageViewer.init();
        };

        if (newImage.tagName.toUpperCase() === 'IMG') {
            // Need to wait for the image to load to get its dimensions
            newImage.onload = initViewer;
        } else {
            // For SVG, it's already in the DOM, so we can initialize directly
            initViewer();
        }
	}
})();