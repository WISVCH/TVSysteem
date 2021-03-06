window.addEventListener('load', function() {
  var results = document.getElementById('results');
  var serviceDb = {
    '_workstation._tcp': 'Workgroup Manager',
    '_ssh._tcp': 'SSH',
    '_daap._tcp': 'iTunes',
    '_airplay': 'AirPlay',
    '_afpovertcp': 'AFP (Apple Filing Protocol)',
    '_raop': 'AirTunes',
  };

  var getHtml_ = function(category, key) {
    if (category == finder.services && key in serviceDb) {
      return key + ' <em>' + serviceDb[key] + '</em>';
    }
    return key;
  };

  var finder;
  var mode = 'service';
  var callback_ = function(opt_error) {
    results.innerHTML = '';
    results.classList.remove('working');

    if (opt_error) {
      var s = document.createElement('strong');
      s.classList.add('warning');
      s.innerText = opt_error;
      results.appendChild(s);
      return console.warn(opt_error);
    }

    var outer = finder.services;
    var inner = finder.ips;
    if (mode == 'ip') {
      outer = finder.ips;
      inner = finder.services;
    }
    // TODO: render information about outer/inner
    // for IPs, render 'last seen at...'
    // for services, render known service type.

    results.innerHTML = '';
    outer.apply(finder).forEach(function(o) {
      var li = document.createElement('li');
      li.innerHTML = getHtml_(outer, o);
      results.appendChild(li);

      var ul = document.createElement('ul');
      inner.call(finder, o).forEach(function(i) {
        var li = document.createElement('li');
        li.innerHTML = getHtml_(inner, i);
        ul.appendChild(li);
      });
      ul.childNodes.length && results.appendChild(ul);
    });
  };

  // Configure the refresh button, then immediately invoke it.
  var refreshBtn = document.getElementById('btn-refresh');
  refreshBtn.addEventListener('click', function() {
    results.innerHTML = '';
    results.classList.add('working');

    finder && finder.shutdown();
    finder = new ServiceFinder(callback_);
  });
  //refreshBtn.click();

  // Configure the mode button, then immediately invoke it twice to reset to
  // the default state (show by service).
  var modeBtn = document.getElementById('btn-mode');
  modeBtn.addEventListener('click', function() {
    var h = document.getElementById('mode-span');
    if (mode == 'service') {
      mode = 'ip';
      h.innerText = 'IP';
    } else {
      mode = 'service';
      h.innerText = 'Service';
    }
    if (finder) {
      callback_();
    }
  });
  modeBtn.click(); modeBtn.click();

  // Configure the close button.
  document.getElementById('btn-close').addEventListener('click', function() {
    window.close();
  });
});

