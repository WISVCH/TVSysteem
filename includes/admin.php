<div class="page admin"></div>

<script type="text/html" id="template-single">
  <form class="form-horizontal">
    <h1 data-key="name">Name</h1>
    <div data-key="description">Description...</div>
    <input type="hidden" data-key="id" name="id" />
     
    <div class="control-group">
      <label class="control-label" for="dateEnd">Date start</label>
      <div class="controls">
        <div class="input-append span3">
          <input class="span10" id="dateStart" data-key="dateStart" type="text">
          <span class="add-on"><input data-key="hasdateStart" type="checkbox" /></span>
        </div>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="dateEnd">Date end</label>
      <div class="controls">
        <div class="input-append span3">
          <input class="span10" id="dateEnd" data-key="dateEnd" type="text">
          <span class="add-on"><input data-key="hasDateEnd" type="checkbox" /></span>
        </div>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="duration">Duration</label>
      <div class="controls">
        <div class="input-append">
          <input class="span3" id="duration" data-key="duration" type="text">
          <span class="add-on">seconds</span>
        </div>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="itemType">Type</label>
      <div class="controls">
        <select id="itemType" data-key="type">
          <option value='poster'>Poster</option>
          <option value='video'>Video</option>
          <option value='ical'>Calendar</option>
          <option value='custom'>Custom</option>
        </select>
      </div>
    </div>

    <div class="type-spec">
      
      <div data-type="poster">
        <div class="control-group">
          <label class="control-label" for="isFullscreen">Fullscreen</label>
          <div class="controls">
            <label class="checkbox"><input type="checkbox" data-key="fullscreen" id="isFullscreen" value=""> Is the poster file fullscreen? (1920x1080)</label>
          </div>
        </div>
        <div class='image dropable' data-key="file">Image</div>
      </div>
      
      <div data-type="custom">
        <div class="control-group">
          <label class="control-label" for="embedCust">Embed HTML</label>
          <div class="controls">
            <textarea id="embedCust" data-key="embed" rows="3">Custom html code</textarea>
          </div>
        </div>
      </div>
      
      <div data-type="video">
        <div class="control-group">
          <label class="control-label" for="embedVid">Embed HTML</label>
          <div class="controls">
            <textarea id="embedVid" data-key="embed" rows="3">Emded code, from, for example, YouTube</textarea>
          </div>
        </div>
      </div>
      
      <div data-type="ical">

      </div>
    
    </div>
    <div class="control-group">
      <div class="controls">
        <button type="submit" class="btn-primary btn">Save</button>
      </div>
    </div>
  </form>
</script>