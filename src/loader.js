(function () {
  // Check if this is a pure SVG page and restructure if needed
  function restructureSVGPage() {
    if (
      document.documentElement &&
      document.documentElement.nodeName.toUpperCase() === "SVG"
    ) {
      // Save reference to the SVG root element
      var svgRoot = document.documentElement;

      // Create HTML wrapper elements
      var html = document.createElementNS('http://www.w3.org/1999/xhtml', 'html');
      var head = document.createElementNS('http://www.w3.org/1999/xhtml', 'head');
      var body = document.createElementNS('http://www.w3.org/1999/xhtml', 'body');

      // Clone the SVG to preserve it
      var svgClone = svgRoot.cloneNode(true);

      // Build structure
      html.appendChild(head);
      html.appendChild(body);
      body.appendChild(svgClone);

      // Replace document root
      var parent = svgRoot.parentNode;
      if (parent) {
        parent.replaceChild(html, svgRoot);
      } else {
        // No parent, try direct replacement
        document.replaceChild(html, svgRoot);
      }

      return true;
    }
    return false;
  }

  function loadJsWithData(jsPath, data) {
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElementNS('http://www.w3.org/1999/xhtml', 'script');
    script.id = "oolong-image-viewer-script"; // Give it an ID to find it
    script.type = "text/javascript";
    script.src = jsPath;
    for (var key in data) {
        script.dataset[key] = data[key];
    }
    head.appendChild(script);
  }

  function loadCss(url) {
    var head = document.getElementsByTagName("head")[0];
    var link = document.createElementNS('http://www.w3.org/1999/xhtml', 'link');
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    head.appendChild(link);
  }

  function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != "function") {
      window.onload = func;
    } else {
      window.onload = function () {
        if (oldonload) {
          oldonload();
        }
        func();
      };
    }
  }

  function findImage() {
    // Check if document.documentElement is SVG (pure SVG page)
    if (
      document.documentElement &&
      document.documentElement.nodeName.toUpperCase() === "SVG"
    ) {
      return true;
    }

    // For regular images, check if body exists
    if (!document.body) {
      return false;
    }

    // Filter out text nodes and only count element nodes
    var elements = [];
    for (var i = 0; i < document.body.childNodes.length; i++) {
      if (document.body.childNodes[i].nodeType === 1) {
        // ELEMENT_NODE
        elements.push(document.body.childNodes[i]);
      }
    }

    // Allow up to 2 elements and check if first one is IMG or SVG
    if (elements.length >= 1 && elements.length <= 2) {
      var nodeName = elements[0].nodeName.toUpperCase();
      return nodeName === "IMG" || nodeName === "SVG";
    }
    return false;
  }

  addLoadEvent(function () {
    if (findImage()) {
      restructureSVGPage();

      var i18nData = {
        tooltipZoomIn: chrome.i18n.getMessage("tooltipZoomIn"),
        tooltipZoomOut: chrome.i18n.getMessage("tooltipZoomOut"),
        tooltipOriginalSize: chrome.i18n.getMessage("tooltipOriginalSize"),
        tooltipFitScreen: chrome.i18n.getMessage("tooltipFitScreen"),
        tooltipChangeBackground: chrome.i18n.getMessage("tooltipChangeBackground")
      };

      loadCss(chrome.runtime.getURL("image-viewer/css/image-viewer.css"));
      loadJsWithData(chrome.runtime.getURL("image-viewer/image-viewer.js"), i18nData);
    }
  });
})();