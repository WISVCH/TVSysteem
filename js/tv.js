// Running system
(function(){

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
function scrollTo(el, duration){
	if(typeof duration == "undefined") duration = 500;
	if(!el){
		var id = $(document.body).attr("data-scroll");
	} else {
		var id = $(el).attr("data-id");
		$(document.body).attr("data-scroll", id);
	}
	
	// Go
	$(".content *").removeClass("active");
	var $item = $("#"+id).addClass("active");
	$(".content").animate({
		scrollTop: $item.position().top + $(".content").scrollTop() - 5
	}, duration);
}

// Events
$(function(){
	$("body").on("keyup", function(event){
		if(String.fromCharCode(event.keyCode) == "A"){
			makeFixed();
			$(this).toggleClass("full");
			setTimeout(releaseFixed, 550);
		}
	});
	
	$("body").on("click", ".bar li[data-id]", function(){
		$(this).siblings().removeClass("active");
		$(this).addClass("active");
		scrollTo(this);
	});
});

})();