/* Functions*/
		var endpoint = "https://ch.tudelft.nl/api/tv";
		
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

/* App Module */
angular.module('stream', ['ngSanitize']).filter('attr', function(){
	return function(input, key){
		if(typeof input !== "object")
			return "filter-attr: wrong parameters;";
		
		var node = input;
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
					b.find("img").attr("src", findSrc(node['image-fullscreen'] || node.body));
					//fillImage(b.find("img"), findSrc(node['image-fullscreen'] || node.body));
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
}).filter('limitToRelevant', function(){
	return function(input){
		if(input.length == 0 || input.constructor.name != "Array") return input;
		
		var todayIndex = -1;
		for(n in input) if(input[n].type == 'today') todayIndex = parseInt(n);
		
		return input
		.filter(function(element, index, array){
			if(index < todayIndex && element.type == 'event' && element.body.indexOf("flitcie.ch.tudelft.nl") == -1)
				return false;
			return true;
		})
		.filter(function(element, index, array){
			if(['event', 'news'].indexOf(element.type) >= 0 && index > todayIndex + 5)
				return false;
			return true;
		});
	}
});

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

function Node(){
	this.date = this.date || this.getDate();
	this.sort_date = this.sort_date || this.getSortDate();
	this.costs = typeof this.costs == 'object' && this.costs.length == 0 ? "" : this.costs;
	this.location = typeof this.location == 'object' && this.location.length == 0 ? "" : this.location;
}
Node.prototype.getDate = function(){
	var date;
	switch(this.type){
		case 'tv_item':
			date = "";
			break;
		case 'event': 
			date = strip(this.date_event);
			break;
		default: 
			date = new Date(this.date_created*1000).toString("ddd d MMMM");
	}
	return date;
};
Node.prototype.getSortDate = function(){
	var date;
	switch(this.type){
		case 'tv_item':
		case 'event': 
			date = Date.parseExact(this.date_event_raw.value, "yyyy-MM-dd HH:mm:ss"); // format: "2012-09-03 06:55:00"
			break;
		default: 
			date = new Date(parseFloat(this.date_created)*1000);
	}
	return date;
};
Node.prototype.getImage = function(){
	var images = [],
			match,
		 	reg = new RegExp(/\"https?:\/\/([^"]*)\"/);
	if(match = reg.exec(this.image)){
		images.push("//"+match[1]);
	}
	return images[0];
};
Node.prototype.getHtml = function(){
	var body;
	switch(this.type){
		case 'tv_item':
			var b = $("<div><div class='full'><img /></div></div>");
			b.find("img").attr("src", findSrc(this['image-fullscreen'] || this.body));
			//fillImage(b.find("img"), findSrc(this['image-fullscreen'] || this.body));
			body = b.html();
			break;
		default: body = this.body;
	}
	return body;
};

/* Controllers */
function StreamController($scope) {
	console.log("Startup");
	
	$scope.nodes = [];
	$scope.active = false;
	
	$.getJSON(rest('all'), function(list) {
		// Add a reference to today
		var today = { nid: '1', type: "today", sort_date: new Date(), title: "Vandaag", date: (new Date()).toString("ddd d MMMM") };
		list.push(today);
		
		$scope.nodes.push.apply(
			$scope.nodes,
			list.map(function(item){
				item.__proto__ = Node.prototype;
				item.constructor.call(item);
				return item;
			})
		);
		$scope.$apply();
  });
	
	$scope.setActive = function(node) {
		if($scope.active) $scope.active.active = false;
		$scope.active = node;
		node.active = true;
	};
	$scope.getClass = function(node){ return node.active ? "active" : ""; };
 
	$scope.isActive = function(node) {
		return !(Math.random() > .5);
	};
	
	$scope.attr = function(node, key){
		console.log("Requested ", key, " for ",node.id);
		return node[key];
	};

}