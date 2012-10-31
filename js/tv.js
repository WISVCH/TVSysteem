(function() {
	var tvApi = {
		init: fillHtml
	};

	var inited = false,
		selector = "#content",
		html = {
		"container": "<div class='container-fluid'><div class='row-fluid'><div class='span3 menu'></div><div class='span9 single-item'></div></div></div>",
		"menu": "<div class='well sidebar-nav'><ul class='nav nav-list'><li class='nav-header status-active'>Actief</li><li class='nav-header status-inactive'>Inactief</li></ul></div>",
		"singleTemplate": "<h1>Single Template</h1>"
	};

	function fillHtml(){
		var sel = $(selector).html(html.container);
		sel.find(".menu").html(html.menu);
		sel.find(".single-item").html(html.singleTemplate);
		inited = true;
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
					s.text(item.name).removeClass("active, inactive").addClass("status-" + item.active ? "active" : "inactive");
					return false;
				} else {
					return true;
				}
			}),
			function(item){
				var header = $(selector).find(item.active ? ".nav-header.status-active" : ".nav-header.status-inactive");
				$("<li></li>").text(item.name).addClass("item").addClass("status-" + item.active ? "active" : "inactive").insertAfter(header);
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
	}

    // export api
    window.tvApi = tvApi;
})();
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