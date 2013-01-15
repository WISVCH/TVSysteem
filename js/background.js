chrome.app.runtime.onLaunched.addListener(function() { 
  	chrome.app.window.create('index.html', {
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      left: 10,
      top: 10,
      frame: 'none'
    });
});