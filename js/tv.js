// Running system
(function(){

var fullscreen = false, scrollTopItem;
function liOffset(){
	return fullscreen ? -50 : 5;
}

// Make all items in main content fixed-height, so current scrollTop won't be affected by going fullscreen
function makeFixed(){
	$(".content li.active").prevAll().each(function(){
		$(this).height($(this).height());
		$(this).css("overflow", "hidden");
	});
}

// Undo above makeFixed
function releaseFixed(){
	$(".content li").each(function(){
		$(this).removeAttr("style");
	});
	scrollTo(false, 0);
}

// Scroll to an element on the page, neatly
function goTo(el, duration){
	if(typeof duration == "undefined") duration = 500;
	if(!el){
		var id = $(document.body).attr("data-scroll");
	} else {
		var id = $(el).attr("data-id");
		$(document.body).attr("data-scroll", id);
	}
	
	// Go
	$("#content *").removeClass("active");
	var $item = scrollTopItem = $("#"+id).addClass("active");
	fullscreen = $item.find(".full").size() > 0;
	
	$("#content").clearQueue().animate({
		scrollTop: $item.position().top + $("#content").scrollTop() - liOffset()
	}, {
		duation: duration, 
		complete: function(){
			if($item.find(".full").size() > 0){
				bar.hide();
			} else {
				bar.show();
			}
			return false;
		}
	});
}

var bar = {
	show: function(){ this.toggle(2); },
	hide: function(){ this.toggle(0); },
	toggle: function(direction){
		var f = ["addClass", "toggleClass", "removeClass"];
		if(typeof direction == 'undefined') direction = 1;
		makeFixed();
		$("body")[f[direction]]("full");
		$("#content").clearQueue().animate({
			scrollTop: scrollTopItem.position().top + $("#content").scrollTop() - liOffset()
		}, 700, function(){
			releaseFixed();
			$("#content").scrollTop(scrollTopItem.position().top + $("#content").scrollTop() - liOffset());
		});
	}
}

// Events
$(function(){
	$("body").on("keyup", function(event){
		if(String.fromCharCode(event.keyCode) == "A"){
			bar.toggle();
		}
	});
	
	$("body").on("click", ".bar li[data-id]", function(){
		$(this).siblings().removeClass("active");
		$(this).addClass("active");
		goTo(this);
	});
});

})();