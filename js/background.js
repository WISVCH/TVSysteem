var finder, state, discoveryTimeout;

exports.data.get(["state"], function(data){
	state = data.state;
}, -1, function(store){
	store({ state: {
		name: "TV Systeem",
		description: "Default text",
		screens: []
	}});
});

var callback = function(opt_error){
	if(opt_error) {
		console.warn("Error: ", opt_error);
		return;
	}
	console.log("Found tv's on ips: ", finder.ips("_ch-tv"));
	
	clearTimeout(discoveryTimeout);
	discoveryTimeout = setTimeout(startDiscovery, 60000);
};
function startDiscovery(){
	clearTimeout(discoveryTimeout);
	finder && finder.shutdown();
	finder = new ServiceFinder(callback, ['_ch-tv']);
}
startDiscovery();

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
  	chrome.app.window.create('control.html', {
      width: 600,
      height: 400,
      minWidth: 600,
      minHeight: 400,
      left: window.screen.width - 600,
      top: window.screen.offsetTop,
      type: 'normal'
    });
});