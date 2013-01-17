(function(){

var exports = window.tv || (window.tv = {});
exports.today = {};

function getEducationPeriods(callback){
	var url = "http://huidigeroosters.tudelft.nl",
		// format: <option value="14">Week 2. 4 van 3/12/12 tot 8/12/12</option>
		regex = /<option value="(\d+)">(.*)<\/option>/gi,
		regexWeek = /Week (.*) van (\d+\/\d+\/\d+) tot (\d+\/\d+\/\d+)/; 
	
	$.get(url, function(data){
		var weeks = [];
		
		while ((match = regex.exec(data)) !== null)
		{
			if((week = regexWeek.exec(match[2])) !== null){
				weeks.push({ 
					name: week[1],
					start: Date.parse(week[2]),
					end: Date.parse(week[3])
				});
			}
		}
		
		console.log(weeks);
	}, "text");
}

getEducationPeriods();

})();