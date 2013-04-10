var finder, state, discoveryTimeout;

// Store default data or get stored data
exports.data.get(["state"], function(data){
	state = data.state;
}, -1, function(store){
	store({ state: {
		name: "TV Systeem",
		description: "Default text",
		screens: []
	}});
});

setTimeout(function(){
// Setup control interface (ie start listening)
chrome.app.window.create('control.html', {
  width: 600,
  height: 400,
  minWidth: 600,
  minHeight: 400,
  left: window.screen.width - 600,
  top: window.screen.offsetTop,
  type: 'normal'
});
},2000);

// Open enough screens
chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('control.html', {
    width: 600,
    height: 400,
    minWidth: 600,
    minHeight: 400,
    left: window.screen.width - 600,
    top: window.screen.offsetTop,
    type: 'normal'
  });
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