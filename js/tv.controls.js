// Concerned with the controls
$(function(){
	var playing;
	
	$(".tools li a").on("click", function(){
		
		var $parent = $(this).parent();
		var action = $parent.attr("data-action");
		
		handle(action);
	
		return false;
	});
	
	function activeLi(){
		var selActive = ".activities li[data-id!=''].active",
			selFirst = ".activities li[data-id!='']:first",
			selFilter = "[data-id!='']",
			$li = ($li = $(selActive)) && $li.size() > 0 && $li || $(selFirst),
			$prev = $li.prev(selFilter).size() > 0 ? $li.prev() : $li.nextAll(selFilter).last(), 
			$next = $li.next(selFilter).size() > 0 ? $li.next() : $li.prevAll(selFilter).last();
			
		return [$prev, $li, $next];
	}
	
	function duration(){
		return 5000;
	}
	
	function handle(action){
		switch(action){
		
			case 'close': 
				window.close();
				break;
			
			case 'full':
				$button = $("[data-action=full]");
				if(!$button.hasClass("active")){
					if(window.chrome && chrome.app) chrome.app.window.current().maximize();
					document.body.webkitRequestFullscreen();
				} else {
					document.webkitExitFullscreen();
					if(window.chrome && chrome.app) chrome.app.window.current().restore();
				}
				$button.toggleClass("active");
				break;
				
			case 'play':
				$button = $("[data-action=play]");
				if(!$button.hasClass("active")){
					playing = setTimeout(function auto(){
						playing = setTimeout(auto, duration());
						handle('down');
					}, duration());
				} else {
					clearTimeout(playing);
				}
				$button.toggleClass("active");
				break;
			case 'up':
				activeLi()[0].click();
				break;		
			case 'down':
				activeLi()[2].click();
				break;
			
		}
	}
	
	window.tv = window.tv || {};
	window.tv.handle = handle;
	
	$(function(){
		$("#bar, #bar *, #content, #content *").on("keydown", function(event){
			// Prevent scrolling with keyboard
			if([32,33,34,35,36,37,38,39,40].indexOf(event.which) != -1){
				event.preventDefault();
				return false;
			}
			return true;
		});
		$(window).on("keydown", function(event){
			if(event.which == 40){
				handle('down');
			} else if(event.which == 38){
				handle('up');
			} else if(event.which == 32){
				handle('play');
			}
		});
	});
	
});