chrome.app.runtime.onLaunched.addListener(function() { 
  	chrome.app.window.create('index.html', {
      width: window.screen.width,
      height: window.screen.height,
      minWidth: 800,
      minHeight: 600,
      left: window.screen.offsetLeft,
      top: window.screen.offsetTop,
      type: 'normal'
    });
});