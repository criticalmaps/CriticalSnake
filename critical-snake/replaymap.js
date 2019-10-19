
if (!Array.prototype.popEach) {
  Array.prototype.popEach = function() {
    const predicate = Array.prototype.slice.call(arguments)[0];
    const len = this.length;
    for (let i = 0; i < len; i++) {
      predicate(this.pop());
    }
  };
}

L.Control.StatsView = L.Control.extend({
  onAdd: function(map) {
    let stats = L.DomUtil.create('label', 'leaflet-bar');
    stats.id = "stats";
    stats.style.padding = "3px 8px";
    stats.style.backgroundColor = "#fff";
    stats.style.display = "none";
    this.ctrl = stats;
    return stats;
  }
});

L.Control.PlaybackCtrls = L.Control.extend({
  onAdd: function(map) {
    let playbackCtrls = L.DomUtil.create('div', 'leaflet-bar');
    playbackCtrls.style.display = "flex";
    playbackCtrls.style.backgroundColor = "#fff";
    playbackCtrls.style.padding = "5px";

    let browse = L.DomUtil.create('input', '', playbackCtrls);
    browse.type = "file";
    browse.id = "browse";
    browse.style.border = "0";

    let progress = L.DomUtil.create('label', '', playbackCtrls);
    progress.id = "progress";
    progress.style.display = "none";

    let playback = L.DomUtil.create('input', '', playbackCtrls);
    playback.type = "button";
    playback.id = "playback";
    playback.value = "▶";
    playback.style.display = "none";
    playback.style.border = "0";

    let slider = L.DomUtil.create('input', '', playbackCtrls);
    slider.type = "range";
    slider.id = "history";
    slider.style.display = "none";

    L.DomEvent.on(playbackCtrls, 'mouseover', () => {
      map.dragging.disable();
    }, this);

    L.DomEvent.on(playbackCtrls, 'mouseout', () => {
      map.dragging.enable();
    }, this);

    L.DomEvent.on(playback, 'click', () => {
      map.onPlaybackClicked(playback, map);
    }, this);

    L.DomEvent.on(browse, 'change', () => {
      map.onBrowseClicked(browse);
    });

    L.DomEvent.on(slider, 'input', () => {
      map.onSliderMoved(slider);
    }, this);

    return playbackCtrls;
  },

  onRemove: function(map) {
    L.DomEvent.off();
  }
});

function createReplayMap(L, $, baseLayer, options) {
  const defaultOptions = {
    htmlElement: 'osm-map',
    center: [52.5219,13.4045],
    zoom: 13,
    showStats: true,
    showControls: true,
    showZoom: true
  };

  options = { ...defaultOptions, ...options };

  let replayMap = new L.map(options.htmlElement, { zoomControl: false });
  replayMap.setView(options.center, options.zoom);
  replayMap.addLayer(baseLayer);

  // Customization points
  replayMap.createMarker = (loc) => { return L.marker(loc.coord); };
  replayMap.onMapZoomed = (replayMap) => {};
  replayMap.on("zoomend", () => {
    replayMap.onMapZoomed(replayMap);
  });

  if (options.showStats) {
    (new L.Control.StatsView({ position: 'topleft' })).addTo(replayMap);
  }
  if (options.showControls) {
    replayMap.onPlaybackClicked = (DomElement) => {};
    replayMap.onBrowseClicked = (DomElement) => {};
    replayMap.onSliderMoved = (DomElement) => {};
    (new L.Control.PlaybackCtrls({ position: 'bottomleft' })).addTo(replayMap);

  }
  if (options.showZoom) {
    (new L.Control.Zoom({ position: 'bottomleft' })).addTo(replayMap);
  }

  replayMap.setPlaybackState = (running) => {
    if (options.showControls) {
      $("#playback").attr("value", running ? "||" : "▶");
    }
  };

  replayMap.updateStats = (stamp, bikes) => {
    if (options.showStats) {
      const templ = bikes ? "📅 {0} 🕗 {1} 📍🚲 {2}" : "📅 {0} 🕗 {1}";
      $("#stats").text(templ.format(
        toDateUTC(stamp), toTimeUTC(stamp), bikes)
      );
    }
  };

  replayMap.setLoadingInProgress = () => {
    if (options.showControls) {
      $("#browse").hide();
      $("#progress").text("Loading..");
      $("#progress").show();
    }
  };

  replayMap.setLoadingDone = () => {
    if (options.showControls) {
      $("#progress").hide();
      $("#playback").show();
    }
    if (options.showStats) {
      $("#stats").css("display", "block");
    }
  };

  replayMap.resetPlaybackPos = (maxFrameIdx) => {
    if (options.showControls) {
      const slider = $("#history");
      slider.attr({ min: 0, max: maxFrameIdx });
      slider.show();
      replayMap.updatePlaybackPos(0);
    }
  }

  replayMap.updatePlaybackPos = (frameIdx) => {
    if (options.showControls) {
      $("#history")[0].value = frameIdx;
    }
  };

  replayMap.participants = [];
  replayMap.candidates = [];
  replayMap.update = (newLocations) => {
    const insert = marker => { return marker.addTo(replayMap); };
    const remove = marker => replayMap.removeLayer(marker);
    const selectBucket = loc => {
      return (loc.snake == null) ? replayMap.candidates : replayMap.participants;
    };

    replayMap.participants.popEach(remove);
    replayMap.candidates.popEach(remove);

    for (let key in newLocations) {
      const loc = newLocations[key];
      const marker = insert(replayMap.createMarker(loc));
      selectBucket(loc).push(marker);
    }

    return replayMap.participants.length + replayMap.candidates.length;
  }

  return replayMap;
}
