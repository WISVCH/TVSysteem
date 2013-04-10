// Concerned with filling and maintaining the content
(function(){
var endpoint = "https://ch.tudelft.nl/api/tv";
/* API
 * - get news & activities; advo's
 * - sort & make unique
 * - switch on type
 *		- custom HTML
 * 		- if hasPhotos -> album
 *		- default layout
 *			- name
 *			- date
 *			- location
 *			- price
 *			- description
 */

function isApp(){
	return window.chrome && chrome.app && chrome.app.runtime;
}

/** 
 * Rest url
 * @return the url for the resource filtered by the given parameters displaying the given fields
 */
function rest(resource, parameters, fields){
	var p = _.map(parameters, function(v, k){ 
		return "parameters["+escape(k)+"]=" + escape(v); 
	});
	
	if(fields && fields.length > 0) 
		p.push("fields="+_.map(fields, escape).join(","));
	
	return endpoint + "/" + resource + (isApp() ? ".json?" : ".jsonp?callback=?&") + p.join("&");
}


function fetch(callback){
	exports.data.get(["stream"], function(object){
		callback(object.stream);
	}, 3600*2*1000, function(store){
		console.log("Fetching", rest("all"));
		$.getJSON(
			rest("all"), 
			function(list){ console.log("storing", list); store({"stream": list}); },
			function(){ console.error("Request to REST failed."); });
	});
}

function update(nodes){
	var c, today = {
		nid: "today",
		date_created: (new Date).getTime()/1000,
		title: "Vandaag",
		status: 1,
		type: "today"
	};
	
	nodes.push(today);
	nodes.sort(sortNodes);
	
	nodes = nodes.slice((c = nodes.indexOf(today))-4, c+6);
	
	updateSidebar(nodes);
	updateMain(nodes);
}

/** 
 * Sort function sortNodes
 * Compare the nodes a and b by measures wanted for the TV System
 * @param a - node A
 * @param b - node B
 * @return Integer defining the difference between the nodes
 */
function sortNodes(a, b){
	return -attrLookup(b, 'date_sort').compareTo(attrLookup(a, 'date_sort'));
}

/**
 * Lookup attribute for <node>
 */
function attrLookup(node, key) {
	
	if(key == 'costs')
		return typeof node.costs == 'string' && parseInt(node.costs.substr(1)) ? node.costs : "";
	
	if(key == 'date_view'){
		var date;
		switch(node.type){
			case 'tv_item':
				date = "";
				break;
			case 'event': 
				date = strip(node.date_event);
				break;
			default: 
				date = new Date(node.date_created*1000).toString("ddd d MMMM");
		}
		return date;
	}		
	
	if(key == 'body'){
		var body;
		switch(node.type){
			case 'tv_item':
				var b = $("<div class='full'><img /></div>");
				fillImage(b.find("img"), findSrc(node['image-fullscreen'] || node.body));
				body = b;
				break;
			default: body = node.body;
		}
		return body;
	}
	
	if(key == 'image'){
		return findSrc(node.image).replace("http://ch/", "https://ch.tudelft.nl/");
	}
	
	if(key == 'location' && node.location){
		return strip(node.location);
	}
	
	if(key == 'date_sort'){
		var date;
		switch(node.type){
			case 'tv_item':
			case 'event': 
				date = Date.parseExact(node.date_event_raw.value, "yyyy-MM-dd HH:mm:ss"); // format: "2012-09-03 06:55:00"
				break;
			default: 
				date = new Date(parseFloat(node.date_created)*1000);
		}
		return date;
	}
		
	if(typeof node[key] != "undefined")
		return node[key];
}

function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent||tmp.innerText;
}

function findSrc(html)
{
	var regexImg = /src="([^"]*)"/ig,
		match = regexImg.exec(html);
	if(match !== null){
		var src = match.pop();
		return src;
	}
	return "";
}

/** 
 * updateSidebar
 * Update the html in the sidebar to reflect the current state
 * 
 * You can hook into this by: @TODO
 */
function updateSidebar(nodes){
	var $template = $(".bar .activities li.template");
	_.each(nodes, function(node){
		var $n = fillTemplate(
			$template.clone(), 
			{
				title: node.title,
				date: attrLookup(node, 'date_view')
			}
		).insertBefore($template).addClass(node.type).attr("data-id", node.nid);
	});
}
/** 
 * updateMain
 * Update the html of the main content to reflect the current state
 * 
 * You can hook into this by: @TODO
 */
function updateMain(nodes){
	var $template = $("#content ul li.template");
	_.each(nodes, function(node){
		var $n = fillTemplate(
			$template.clone(), 
			{
				title: node.title,
				date: attrLookup(node, 'date_view'),
				costs: attrLookup(node, 'costs'),
				location: attrLookup(node, 'location'),
				content: attrLookup(node, 'body'),
				image: attrLookup(node, 'image')
			}
		).insertBefore($template).addClass(node.type).attr("id", node.nid);
	});
}

/**
 * fillTemplate 
 * traverse over a object and look in a $template (jQuery) for elements matching .<key>, fill them with <value>
 */
function fillTemplate($template, data){
	$template.removeClass("template");
	for(n in data){
		var value = typeof data[n] == "function" ? data[n]() : data[n];
		var $elem = $template.find("."+n);
		var tag = $elem.get(0).nodeName.toLowerCase();
		
		if(tag == "span")
			$elem.text(value);
		else if(tag == "img"){
			$elem.src = "loading.gif";
			if(isApp() && value) fillImage($elem, value);
			else if(value) $elem.attr("src", value);
		}
		else
			$elem.append(value);
	}
	$template.find("img[src='']").remove();
	return $template;
}

/**
 * fillImage
 * needed to load images
 */
function fillImage($elem, src){
	var key = "image-dataurl["+src+"]";
	if(!src) return;
	
	exports.data.get(
		[key], 
		function handle(response){
			if(response[key] != null)
				$elem.attr("src", response[key]);
		}, 
		-1,
		function orElse(store){
			var request = new XMLHttpRequest();
			request.open("GET", src);
			request.responseType = "blob";
			request.onloadend = function(response){
				var img = document.createElement("img");
				img.onload = function (e) {
					var data = {};
				    data[key] = imageToDataUrl(img); // Convert temporary url to data url
				    window.URL.revokeObjectURL(img.src); // Cleanup
				    store(data); // Continue procedure
				};
				img.src = window.URL.createObjectURL(response.target.response);
			};
			request.send();
		}
	);
	
	// Chain
	return $elem;
}

function imageToDataUrl(img){
	var canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	canvas.getContext("2d").drawImage(img, 0, 0);
	url = canvas.toDataURL();
	canvas = null;
	return url;
}

window.update = function(){
	fetch(update);
};
window.rest = rest;
$(function(){
	$("#update").on("click", window.update).hide();
	
	fetch(update);
});

})();