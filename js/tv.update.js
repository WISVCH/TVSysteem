// Concerned with filling and maintaining the content
(function(){

var endpoint = "http://ch/api/tv";
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
		
	return endpoint + "/" + resource + ".jsonp" + "?callback=?&" + p.join("&");
}


function fetch(callback){
	$.getJSON(rest("nodes", { type: "news,event", language: "nl", status: 1 }), callback);
}

fetch(update);

function update(nodes){
	nodes.push({
		created: (new Date).getTime()/1000,
		title: "Vandaag",
		status: 1,
		type: "today"
	});
	nodes.sort(sortNodes);
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
function sortNodes(a, b){ return 1; }

/**
 * Lookup attribute for <node>
 */
function attrLookup(node, key) {
	
	if(key == 'date_view')
		return new Date(node.created*1000).toString("ddd d MMMM");
	
	if(key == 'date_sort')
		return node.created;
		
	if(typeof node[key] != "undefined")
		return node[key];
}
function formatDate(){ return arguments[0]; }

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
		).insertAfter($template).addClass(node.type).attr("data-id", node.nid);
	});
}
/** 
 * updateMain
 * Update the html of the main content to reflect the current state
 * 
 * You can hook into this by: @TODO
 */
function updateMain(nodes){}

/**
 * fillTemplate 
 * traverse over a object and look in a $template (jQuery) for elements matching .<key>, fill them with <value>
 */
function fillTemplate($template, data){
	$template.removeClass("template");
	for(n in data){
		$template.find("."+n).text(typeof data[n] == "function" ? data[n]() : data[n]);
	}
	return $template;
}

})();