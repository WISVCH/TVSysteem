// Concerned with the controls
$(function(){
	
	$(".tools li a").on("click", function(){
		
		var $parent = $(this).parent();
		var action = $parent.attr("data-action");
		
		handle(action);
	
		return false;
	});
	
	function handle(action){
		switch(action){
		
			case 'close': 
				window.close();
				break;
			
			case 'full':
				$button = $("[data-action=full]");
				if(!$button.hasClass("active")){
					if(chrome && chrome.app) chrome.app.window.current().maximize();
					document.body.webkitRequestFullscreen();
				} else {
					document.webkitExitFullscreen();
					if(chrome && chrome.app) chrome.app.window.current().restore();
				}
				$button.toggleClass("active");
				break;
				
			case 'play':
			case 'up':
			case 'down':
				break;
			
		}
	}
	
	window.tv = window.tv || {};
	window.tv.handle = handle;
	
});