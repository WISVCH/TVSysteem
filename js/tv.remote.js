// Concerned with the remote control
var finder;
$(function(){
	
	var ratio = 1/10;
	
	function update(){
		$(".tv").each(function(){
			var props = { id: 0, x: 0, y: 0, w: 1080, h: 1920};
			for(n in props){ 
				props[n] = $(this).find("[name="+n+"]").val();
			}
			console.log("Draw with", props);
			$(this).css({
				width: props.w * ratio,
				height: props.h * ratio,
				top: props.y * ratio,
				left: props.x * ratio
			});
		});
	}
	update();
	$(".plane").on("change keyup mouseup", ".tv input", update);
	$(".plane").on("click", ".tv-template a", function(){
		var tv = $(".tv-template").clone(false).removeClass('tv-template').addClass('tv');
		tv.children("a").remove();
		tv.appendTo('.plane');
		update();
		tv.jqDrag(".drag").jqResize(".resize");
	});
	
  
});