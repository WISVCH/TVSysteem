(function() {
	var tvApi = {
		init: fillHtml,
		fill: fillItems,
		items: [],
		defaults: {}
	};

	var inited = false,
		selector = "#content > .admin",
		html = {
		"container": "<div class='container-fluid'><div class='row-fluid'><div class='span3 menu'></div><div class='span9 well single-item'></div></div></div>",
		"menu": "<div class='well sidebar-nav'><ul class='nav nav-list'><li class='nav-header status-active' data-status='active'>Actief</li><li class='nav-header status-inactive' data-status='inactive'>Inactief</li></ul></div>",
		"singleTemplate": $("#template-single").html()
	};

	var editingId = false;

	function open(id){
		editingId = id;
		var item = get(id);

		$(".single-item [data-key]").each(function(el){
			var key = this.dataset.key;
			if(typeof item[key] == "undefined" && typeof tvApi.defaults[key] != "undefined"){
				$(this).attr("placeholder", tvApi.defaults[key]);
			} else {
				if(["H1", "DIV"].indexOf(this.nodeName) > -1)
					$(this).text(item[key]);
				else
					$(this).val(item[key]);
			}
		});
		
		$("#itemType").bind("change", function(){
			item.type = this.value;
			$(".type-spec").attr('data-type', item.type);
		}).trigger("change");
	}

	function save(){
		var item = {};

		$(".single-item [data-key]:visible, .single-item [data-key][type=hidden]").each(function(el){
			var key = this.dataset.key;
			item[key] = (["H1", "DIV"].indexOf(this.nodeName) > -1) ? $(this).text() : $(this).val();
		});

		set(item.id, item);
	}

	function get(id){
		return _.find(tvApi.items, function(item){ return item.id == id; });
	}
	function set(id, obj){
		var i = get(id);
		for(n in i){
			delete i[n];
		}
		_.extend(i, obj);
	}

	function fillHtml(){
		var sel = $(selector).html(html.container);
		sel.find(".menu").html(html.menu);
		sel.find(".single-item").html(html.singleTemplate);
		sel.find(".nav-header").each(function(i, s){
			s = $(s);
			s.append("<div class='add-item-btn'>+</div>");
		});
		sel.delegate(".add-item-btn", "click", function(){
			tvApi.items.push({
				id: (new Date()).getTime(),
				name: "New event",
				active: $(this).parents("[data-status=active]").size() > 0
			});
			tvApi.fill(tvApi.items);
		}).delegate(".menu li.item", "click", function(){ 
			$(this).addClass("active").siblings().removeClass("active");
			open(this.id);
		}).delegate(".single-item [type=submit]", "click", save);
		inited = true;
		return tvApi;
	}

	function fillItems(items, filter){
		// Make sure each item is in the html
		_.each(
			_.filter(items, function(item){
				var s = $(selector).find("ul li.item-"+item.id);
				if(s.size() > 0){
					// Put in correct unit
					if(item.active && s.hasClass("status-inactive")){
						s.remove().insertAfter($(selector).find(".nav-header.status-active"));
					} else 
					if(!item.active && s.hasClass("status-active")){
						s.remove().insertAfter($(selector).find(".nav-header.status-inactive"));
					}
					// Update
					s.removeClass("active, inactive").addClass("status-" + (item.active ? "active" : "inactive"));
					s.children("a").text(item.name);
					return false;
				} else {
					return true;
				}
			}),
			function(item){
				var header = $(selector).find(item.active ? ".nav-header.status-active" : ".nav-header.status-inactive");
				var li = $("<li><a></a></li>")
					.addClass("item item-" + item.id)
					.addClass("status-" + (item.active ? "active" : "inactive"))
					.attr("id", item.id);
				li.insertAfter(header);
				li.children("a").text(item.name).attr("href", "#item-"+item.id);
			}
		);

		// Filter
		$(selector).find("ul li.item").each(function(s){
			var s = $(s);
			if(!filter || s.text().indexOf(filter) > -1){
				s.removeClass("no-match");
			} else {
				s.addClass("no-match");
			}
		});

		tvApi.items = items;
		return tvApi;
	}

    // export api
    window.tvApi = tvApi;
})();

tvApi.init().fill([
	{
		id: 1,
		name: "Informaticalezing Q1",
		active: false
	},
	{
		id: 2,
		name: "Wiskundelezing",
		active: true
	},
	{
		id: 3,
		name: "Informaticalezing",
		active: true
	}
]).fill([
	{
		id: 1,
		name: "Informaticalezing Q1",
		active: true
	},
	{
		id: 2,
		name: "Wiskundelezing",
		active: false
	},
	{
		id: 3,
		name: "Informaticalezing",
		active: false
	}
]);

function setPage(page){
	document.body.dataset.page = page;
}

/*
<div class="container-fluid">
      <div class="row-fluid">
        <div class="span3">
          <div class="well sidebar-nav">
            <ul class="nav nav-list">
              <li class="nav-header">Sidebar</li>
              <li class="active"><a href="#">Link</a></li>
              <li><a href="#">Link</a></li>
              <li><a href="#">Link</a></li>
              <li><a href="#">Link</a></li>
              <li class="nav-header">Sidebar</li>
              <li><a href="#">Link</a></li>
              <li><a href="#">Link</a></li>
              <li><a href="#">Link</a></li>
              <li><a href="#">Link</a></li>
              <li><a href="#">Link</a></li>
              <li><a href="#">Link</a></li>
              <li class="nav-header">Sidebar</li>
              <li><a href="#">Link</a></li>
              <li><a href="#">Link</a></li>
              <li><a href="#">Link</a></li>
            </ul>
          </div><!--/.well -->
        </div><!--/span-->
        <div class="span9">
          <div class="hero-unit">
            <h1>Hello, world!</h1>
            <p>This is a template for a simple marketing or informational website. It includes a large callout called the hero unit and three supporting pieces of content. Use it as a starting point to create something more unique.</p>
            <p><a class="btn btn-primary btn-large">Learn more »</a></p>
          </div>
          <div class="row-fluid">
            <div class="span4">
              <h2>Heading</h2>
              <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
              <p><a class="btn" href="#">View details »</a></p>
            </div><!--/span-->
            <div class="span4">
              <h2>Heading</h2>
              <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
              <p><a class="btn" href="#">View details »</a></p>
            </div><!--/span-->
            <div class="span4">
              <h2>Heading</h2>
              <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
              <p><a class="btn" href="#">View details »</a></p>
            </div><!--/span-->
          </div><!--/row-->
          <div class="row-fluid">
            <div class="span4">
              <h2>Heading</h2>
              <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
              <p><a class="btn" href="#">View details »</a></p>
            </div><!--/span-->
            <div class="span4">
              <h2>Heading</h2>
              <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
              <p><a class="btn" href="#">View details »</a></p>
            </div><!--/span-->
            <div class="span4">
              <h2>Heading</h2>
              <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
              <p><a class="btn" href="#">View details »</a></p>
            </div><!--/span-->
          </div><!--/row-->
        </div><!--/span-->
      </div><!--/row-->

      <hr>

      <footer>
        <p>© Company 2012</p>
      </footer>

    </div>*/