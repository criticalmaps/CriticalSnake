
L.Control.StatsView = L.Control.extend({
  onAdd: function(map) {
    let stats = L.DomUtil.create('label', 'leaflet-bar');
    stats.id = "stats";
    stats.style.padding = "3px 8px";
    stats.style.backgroundColor = "#fff";
    stats.style.display = "none";
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

    L.DomEvent.on(slider, 'input', () => {
      map.onSliderMoved(slider);
    }, this);

    return playbackCtrls;
  },

  onRemove: function(map) {
    L.DomEvent.off();
  }
});

function createReplayMap(L, baseLayer, options) {
  const defaultOptions = {
    htmlElement: 'osm-map',
    center: [52.5219,13.4045],
    zoom: 13,
    showStats: true,
    showControls: true,
    showZoom: true
  };

  options = { ...defaultOptions, ...options };

  let bikeMap = new L.map(options.htmlElement, { zoomControl: false });
  bikeMap.setView(options.center, options.zoom);
  bikeMap.addLayer(baseLayer);

  // Customization points
  bikeMap.createMarker = (loc) => { return L.marker(loc.coord); };
  bikeMap.onMapZoomed = (bikeMap) => {};
  bikeMap.on("zoomend", () => {
    bikeMap.onMapZoomed(bikeMap);
  });

  if (options.showStats) {
    (new L.Control.StatsView({ position: 'topleft' })).addTo(bikeMap);
  }
  if (options.showControls) {
    bikeMap.onPlaybackClicked = (DomElement) => {};
    bikeMap.onSliderMoved = (DomElement) => {};
    (new L.Control.PlaybackCtrls({ position: 'bottomleft' })).addTo(bikeMap);
  }
  if (options.showZoom) {
    (new L.Control.Zoom({ position: 'bottomleft' })).addTo(bikeMap);
  }

  bikeMap.participants = [];
  bikeMap.candidates = [];
  bikeMap.update = (newLocations) => {
    bikeMap.participants.forEach(marker => bikeMap.removeLayer(marker));
    bikeMap.candidates.forEach(marker => bikeMap.removeLayer(marker));

    let participants = [];
    let candidates = [];
    for (let key in newLocations) {
      const loc = newLocations[key];
      const marker = bikeMap.createMarker(loc);
      marker.addTo(bikeMap);
      if (loc.snake == null)
        candidates.push(marker);
      else
        participants.push(marker);
    }

    bikeMap.participants = participants;
    bikeMap.candidates = candidates;
    return participants.length + candidates.length;
  }

  return bikeMap;
}
