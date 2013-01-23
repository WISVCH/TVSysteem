var exports = exports || {};
// Tools, that may come handy
(function(exports){

	var storage = window.chrome && chrome.storage && chrome.storage.local || {
		get: function get(keys, callback){
			if(typeof keys == 'string') keys = [keys];
			
			var ret = {};
			for(n in keys){
				var g, key = keys[n];
				if((g = localStorage.getItem(key)))
					ret[key] = JSON.parse(g);
			}
			callback(ret);
		},
		set: function set(object){
			for(n in object){
				localStorage.setItem(n, JSON.stringify(object[n]));
			}
		}
	};

	exports.data = {
		/**
		 * Get cached data
		 * @param keys Get the following keys from the cache
		 * @param callback Function to call with <data>
		 * @param maxAge Max num of milliseconds since data was stored
		 * @param orElse Function(store) that fetches the data and calls the store function with the data
		 */
		get: function get(keys, callback, maxAge, orElse){
			if(typeof keys == 'string') keys = [keys];
			
			storage.get(keys, function(object){
				console.log("Found in cache", object, "for", keys.join(", "));
				var ret = {};
				for(n in keys){
					var key = keys[n];
					if(
						typeof object[key] == 'undefined' || 
						typeof object[key].data == 'undefined' || 
						maxAge >= 0 && (new Date).getTime() - object[key].time > maxAge
					){
						console.log(
							"Rejected cache since", 
							typeof object[key] == 'undefined' && "key not found in cache",
							object[key] && typeof object[key].data == 'undefined' && "cache was old format",
							object[key] && maxAge >= 0 && (new Date).getTime() - object[key].time > maxAge && 'cache expired'
						);
						orElse(function(object){
							console.log("orElse resulted in ", object);
							exports.data.set(object);
							callback(object);
						});
						return;
					}
					ret[key] = object[key].data;	
				}
				callback(ret);
			});		
		},
		set: function set(object){
			var store = {}, now = (new Date).getTime();
			for(n in object){
				store[n] = { time: now, data: object[n] };
			}
			console.log("Saving in cache", store);
			storage.set(store);
		}
	};

})(exports);