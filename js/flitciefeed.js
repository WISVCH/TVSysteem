/* This script is written by Herman Banken. It's forbidden to copy or reuse this script or parts of it, anywhere without permission. */
/* Please contact me at hermanbanken.nl */

var Gallery = (function(endpoint, apikey, $, prefix){
	
	function item(id, callback, data){
		if(typeof id == "string" && id.indexOf("/") != -1) 
			id = id.split("/").pop();
		$.ajax({
			url: endpoint + '/item/'+id,
			dataType: 'json',
			success: callback,
			headers: {
				"X-Gallery-Request-Key": apikey
			},
			data: data
		});
	}
	
	function items(ids, callback, data){
		var total = ids.length, collection = [];
		while(ids.length > 0){
			var go = ids.splice(0, 9);
			
			$.ajax({
				url: endpoint + '/items',
				dataType: 'json',
				success: function(list){
					[].push.apply(collection, list);
					if(collection.length == total)
						callback(collection);
				},
				headers: {
					"X-Gallery-Request-Key": apikey
				},
				data: $.extend({
					urls: toGalleryJSON(go.map(function(url){
						return (url.indexOf("/") == -1) ? prefix + '/item/' + url : url;
					}))
				}, data)
			});
		}
		
	}
	
	function toGalleryJSON(list){
		return "[\""+list.join("\",\"")+"\"]";
	}
	
	function members(id, callback, limit){
		// Fallback to item 1 if not set
		id = typeof id == 'undefined' ? 1 : id;
		item(id, function(i){
			// Select the members, convert url, max limit
			callback(i.members.map(function(url){
				return url.split("/").pop();
			}).slice(0, limit));
		});
	}
	
	return {
		item: item,
		items: items,
		members: members
	};
	
})("proxy.php?path=", "set-in-proxy.php", jQuery, "https://flitcie.ch.tudelft.nl/rest");

var FlitCie = (function(gallery, $){
	
	var _besturen;
	var _bestuur;
	var _albums;
	var _albumsExpanded;
	
	function expand(flatAr, callback){
		var structure = {};
		var todo = flatAr.length;
		gallery.items(
			flatAr, 
			function(list){
				callback(list);
			}
		);
	}
	
	function besturen(callback){
		if(_besturen)
			callback(_besturen);
		else gallery.members(1, function(list){	
			_besturen = list;
			callback(list);
		}, 10);
	}
	
	function bestuur(callback){
		if(_bestuur)
			callback(_bestuur);
		else besturen(function(list){
			gallery.item(list[0], function(item){
				_bestuur = item;
				callback(item);
			});
		});
	}
	
	function setCache(input){
		if(typeof(input)=='object'&&(input instanceof Array))
			input.forEach(cache);
		else if(input.url) {
			localStorage.setItem(input.url, JSON.stringify(input));
		}
	}
	function getCache(uri){
		if(typeof(uri)=='object'&&(uri instanceof Array))
			return uri.map(function(u){
				return getCache(u);
			});
		else if(typeof(uri)=='string')
			return localStorage.getItem(uri);
	}
	
	function nextAlbum(callback){
		bestuur(function(item){
			if(!item.members || item.members.length == 0) return callback(false);
			
			var album = item.members[Math.floor(Math.random()*item.members.length)];
			
			gallery.item(item.entity.id, function(item){
				expand(item.members, function(members){
					item.members = members;
					callback(item.members.map(function(photo){
						return {
							src: photo.entity.resize_url_public,
							alt: item.entity.title + " " + photo.entity.title
						};
					}));
				});
			}, { scope: 'all', type: 'photo' });
		}, null, false);
	}
	
	return {	
		album: nextAlbum
	};
	
})(Gallery, jQuery);