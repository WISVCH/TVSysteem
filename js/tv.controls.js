// Concerned with the controls
$(function(){
	
	$(".tools li a").on("click", function(){
		
		var $parent = $(this).parent();
		var action = $parent.attr("data-action");
		
		switch(action){
		
			case 'close': 
				window.close();
				break;
			
			case 'full':
				if(!$parent.hasClass("active")){
					document.body.webkitRequestFullscreen();
				} else {
					document.webkitExitFullscreen();
				}
				$parent.toggleClass("active");
				break;
				
			case 'play':
			case 'up':
			case 'down':
				break;
			
		}
	
		return false;
	});
	
});