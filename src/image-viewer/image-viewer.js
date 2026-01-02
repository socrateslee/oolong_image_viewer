function ImageViewer(img, i18n){
    var isSVG = img.tagName === 'SVG' || img.tagName === 'svg';
    var _this = this;
    var offsetX, offsetY;
    var originalWidth, originalHeight;
    
    this.scale = 1.0;

    // Get original dimensions
    if (isSVG) {
        if (img.viewBox && img.viewBox.baseVal && img.viewBox.baseVal.width > 0) {
            originalWidth = img.viewBox.baseVal.width;
            originalHeight = img.viewBox.baseVal.height;
        } else {
            originalWidth = parseInt(img.getAttribute('width')) || img.clientWidth;
            originalHeight = parseInt(img.getAttribute('height')) || img.clientHeight;
        }
    } else {
        originalWidth = img.naturalWidth;
        originalHeight = img.naturalHeight;
    }

    function applyZoom() {
        if (!originalWidth || !originalHeight) return;
        
        var newWidth = originalWidth * _this.scale;
        var newHeight = originalHeight * _this.scale;

        if (isSVG) {
            img.setAttribute('width', newWidth);
            img.setAttribute('height', newHeight);
        } else {
            img.width = newWidth;
            img.height = newHeight;
        }
    }

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

        e.preventDefault();
        e.stopPropagation();

        offsetX = e.clientX;
        offsetY = e.clientY;

        if(!img.style.left) img.style.left='0px';
        if(!img.style.top) img.style.top='0px';

        var coordX = parseInt(img.style.left);
        var coordY = parseInt(img.style.top);

		img.style.cursor = "grabbing";
        document.onmousemove = function(e){
            if (!e) {e = window.event};
            e.preventDefault();
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
		_this.scale *= 1.25;
        applyZoom();
	}

	this.zoomout = function(){
		_this.scale *= 0.8;
        applyZoom();
	}

	this.original = function(){
		if (isSVG || !originalWidth || originalWidth === 0) {
            _this.showToast("No original size found.");
		} else {
            _this.scale = 1.0;
            applyZoom();
		}
	}

    this.fitScreen = function() {
        if (!originalWidth || !originalHeight) return;

        var targetWinWidth = window.innerWidth * 0.9;
        var targetWinHeight = window.innerHeight * 0.9;

        var widthRatio = targetWinWidth / originalWidth;
        var heightRatio = targetWinHeight / originalHeight;

        _this.scale = Math.min(widthRatio, heightRatio);
        
        applyZoom();

        img.style.left = (window.innerWidth - (originalWidth * _this.scale)) / 2 + 'px';
        img.style.top = (window.innerHeight - (originalHeight * _this.scale)) / 2 + 'px';
    }

	this.init = function(){
        var zoomInIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2V7z"/></svg>`;
        var zoomOutIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z"/></svg>`;
        var originalSizeIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-7 7H3v4c0 1.1.9 2 2 2h4v-2H5v-4zM5 5h4V3H5c-1.1 0-2 .9-2 2v4h2V5zm14-2h-4v2h4v4h2V5c0-1.1-.9-2-2-2zm0 16h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4z"/></svg>`;
        var fitScreenIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 3h18v18H3V3zm2 2v14h14V5H5z"/><path d="M7 12h10M15 10l2 2-2 2M9 10l-2 2 2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

        var paletteIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.32-.13-.62-.34-.85-.27-.28-.38-.58-.38-.86 0-1.1.9-2 2-2h.5a4.5 4.5 0 0 0 4.5-4.5c0-4.54-4.03-8.29-8.29-8.29zM7 9.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm2.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm4.5-3a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm3-4.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z"/></svg>`;

		var newNode = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
		newNode.className = "image-viewer-toolbar";
		newNode.innerHTML = 
			'<button id="image-viewer-zoomin">'+zoomInIcon+'</button>'
			+ '<button id="image-viewer-zoomout">'+zoomOutIcon+'</button>'
			+ '<button id="image-viewer-original">'+originalSizeIcon+'</button>'
			+ '<button id="image-viewer-fit-screen">'+fitScreenIcon+'</button>'
            + '<button id="image-viewer-palette">'+paletteIcon+'</button>'
            + '<div class="image-viewer-palette" id="image-viewer-color-picker"></div>';
		document.body.appendChild(newNode);

        // Use querySelector on newNode directly instead of getElementById to avoid timing issues
        var zoomInButton = newNode.querySelector("#image-viewer-zoomin");
        zoomInButton.title = i18n.tooltipZoomIn;
		zoomInButton.onclick = this.zoomin;

        var zoomOutButton = newNode.querySelector("#image-viewer-zoomout");
		zoomOutButton.title = i18n.tooltipZoomOut;
        zoomOutButton.onclick = this.zoomout;

        var originalButton = newNode.querySelector("#image-viewer-original");
		originalButton.title = i18n.tooltipOriginalSize;
        originalButton.onclick = this.original;

        var fitScreenButton = newNode.querySelector("#image-viewer-fit-screen");
        fitScreenButton.title = i18n.tooltipFitScreen;
		fitScreenButton.onclick = this.fitScreen;

        // Palette Logic
        var paletteButton = newNode.querySelector("#image-viewer-palette");
        var paletteContainer = newNode.querySelector("#image-viewer-color-picker");
        
        paletteButton.title = i18n.tooltipChangeBackground;
        
        paletteButton.onclick = function(e) {
            e.stopPropagation();
            paletteContainer.classList.toggle('show');
        };

        // Close palette when clicking outside
        document.addEventListener('mousedown', function(e) {
             if (paletteContainer.classList.contains('show') && !paletteButton.contains(e.target) && !paletteContainer.contains(e.target)) {
                 paletteContainer.classList.remove('show');
             }
        });

        var colors = [
            { color: '#000', title: 'Black' },
            { color: '#fff', title: 'White' },
            { color: 'transparent', title: 'Transparent', className: 'image-viewer-bg-checkerboard' },
            { color: '#808080', title: 'Gray' },
            { color: '#e0e0e0', title: 'Light Gray' },
            { color: '#f0e68c', title: 'Khaki' },
            { color: '#ffc0cb', title: 'Pink' },
            { color: '#1E90FF', title: 'Blue' },
            { color: '#32CD32', title: 'Green' },
            { color: '#8B4513', title: 'Brown' },
            { color: '#800080', title: 'Purple' },
            { color: '#FF0000', title: 'Red' }
        ];

        colors.forEach(function(c) {
            var btn = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
            btn.className = 'image-viewer-palette-btn';
            if (c.className) {
                btn.classList.add(c.className);
            } else {
                btn.style.backgroundColor = c.color;
            }
            btn.title = c.title;
            btn.onclick = function(e) {
                e.stopPropagation();
                var docBody = document.body || document.getElementsByTagName('body')[0];
                if (c.className) {
                    docBody.style.backgroundColor = '';
                    docBody.style.backgroundImage = '';
                    docBody.className = c.className;
                } else {
                    docBody.className = '';
                    docBody.style.backgroundImage = 'none';
                    docBody.style.backgroundColor = c.color;
                }
                paletteContainer.classList.remove('show');
            };
            paletteContainer.appendChild(btn);
        });

        // Make toolbar draggable
        var toolbarDragging = false;
        var toolbarOffsetX, toolbarOffsetY;

        newNode.addEventListener('mousedown', function(e) {
            // Only allow dragging if clicking on the toolbar background, not buttons
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }

            toolbarDragging = true;
            toolbarOffsetX = e.clientX - newNode.offsetLeft;
            toolbarOffsetY = e.clientY - newNode.offsetTop;
            newNode.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (toolbarDragging) {
                newNode.style.left = (e.clientX - toolbarOffsetX) + 'px';
                newNode.style.top = (e.clientY - toolbarOffsetY) + 'px';
                newNode.style.right = 'auto';
                newNode.style.bottom = 'auto';
            }
        });

        document.addEventListener('mouseup', function() {
            if (toolbarDragging) {
                toolbarDragging = false;
                newNode.style.cursor = 'grab';
            }
        });

        // Set initial cursor for toolbar
        newNode.style.cursor = 'grab';

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
		img.style.position = "absolute";
		img.style.cursor = "grab";
		img.style.userSelect = "none";
		img.style.webkitUserSelect = "none";
		img.style.pointerEvents = "auto";

		// Prevent browser's default drag-to-save behavior
		img.addEventListener('dragstart', function(e) {
			e.preventDefault();
		});

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
        // Save the i18n data before we modify the DOM
        var i18nData = i18n;

        // Remove ALL event listeners from the original image by cloning without listeners
        // This is necessary to remove browser's built-in image document zoom behavior
        var cleanImage = imageElement.cloneNode(true);

        // Copy over the loaded state for IMG elements
        if (imageElement.tagName.toUpperCase() === 'IMG' && imageElement.complete) {
            // Image is already loaded, the clone will have the same src
        }

        // Remove the original image
        var parent = imageElement.parentNode;
        if (parent) {
            parent.removeChild(imageElement);
        }

        // Hide the original page content
        document.body.innerHTML = '';
        document.body.style.overflow = 'hidden';
        document.body.style.backgroundColor = '#000';

        // Append the cleaned image (no event listeners)
        document.body.appendChild(cleanImage);

        var initViewer = function() {
            var imageViewer = new ImageViewer(cleanImage, i18nData);
            imageViewer.init();
        };

        if (cleanImage.tagName.toUpperCase() === 'IMG') {
            var viewerInitialized = false;

            var safeInitViewer = function() {
                if (!viewerInitialized) {
                    viewerInitialized = true;
                    initViewer();
                }
            };

            // Check if the CLONED image is already loaded (checking complete AND naturalWidth/Height)
            if (cleanImage.complete && cleanImage.naturalWidth > 0 && cleanImage.naturalHeight > 0) {
                // Clone is already loaded, initialize immediately
                safeInitViewer();
            } else {
                // Need to wait for the clone to load its dimensions
                cleanImage.onload = safeInitViewer;
                // Also handle error case
                cleanImage.onerror = function() {
                    console.error('Failed to load image:', cleanImage.src);
                };

                // Fallback: Check periodically if image has loaded (in case onload doesn't fire)
                var checkInterval = setInterval(function() {
                    if (cleanImage.complete && cleanImage.naturalWidth > 0 && cleanImage.naturalHeight > 0) {
                        clearInterval(checkInterval);
                        safeInitViewer();
                    }
                }, 100);

                // Stop checking after 10 seconds
                setTimeout(function() {
                    clearInterval(checkInterval);
                }, 10000);
            }
        } else {
            // For SVG, it's already in the DOM, so we can initialize directly
            initViewer();
        }
	}
})();
