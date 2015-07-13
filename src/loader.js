(function(){
   function loadJs(jsPath){
      var head= document.getElementsByTagName('head')[0];
      var script= document.createElement('script');
      script.type= 'text/javascript';
      script.src= jsPath;
      head.appendChild(script);
   }

	function loadCss(url) {
		var link = document.createElement("link");
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = url;
		document.getElementsByTagName("head")[0].appendChild(link);
	}

	function addLoadEvent(func) {
		var oldonload = window.onload;
		if (typeof window.onload != 'function') {
			window.onload = func;
		} else {
			window.onload = function() {
			if (oldonload) {
				oldonload();
			}
			func();
			}
		}
	}

	function findImage() {
		return (document.body && document.body.childNodes.length == 1 && document.body.childNodes[0].nodeName == "IMG") ? true : false;
	}

	addLoadEvent(function(){
		if(findImage()){
			loadCss(chrome.runtime.getURL("image-viewer/bootstrap/css/bootstrap.min.css"));
			loadCss(chrome.runtime.getURL("image-viewer/css/image-viewer.css"));
			loadJs(chrome.runtime.getURL("image-viewer/image-viewer.js"));
		}
	});

})();
