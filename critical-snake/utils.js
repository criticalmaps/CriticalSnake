
function createCityCoordFilter(name) {
  switch(name.toLowerCase()) {
    case "":
      return (coord) => true;
    case "berlin":
      return createBoundsCoordFilter([[52.40,13.23],[52.61,13.56]]);
    case "barcelona":
      return createBoundsCoordFilter([[41.26,2.00],[41.45,2.29]]);
    case "hamburg":
      return createBoundsCoordFilter([[53.50,9.80],[53.61,10.13]]);
    default:
      console.warn("Unknown coordinate filter:", name);
      return (coord) => true;
  }
}

function createBoundsCoordFilter(latlng) {
  const bounds = L.latLngBounds(latlng);
  return (coord) => bounds.contains(coord);
}

const toFloat = (oldFormat) => {
  let chars = oldFormat.toString().split('');
  chars.splice(-6, 0, '.');
  return chars.join( '' );
};

const toBool = (str) => {
  // Will match one and only one of the strings 'true','1', or 'on' rerardless
  // of capitalization and regardless off surrounding white-space.
  regex=/^\s*(true|1|on)\s*$/i
  return regex.test(str);
}

function toDateUTC(timestamp) {
  const d = new Date(timestamp * 1000);
  const pad2 = (val) => (val < 10 ? "0" : "") + val;
  return "{0}-{1}-{2}".format(
    d.getFullYear(), pad2(d.getMonth() + 1), pad2(d.getDate())
  );
}

function toTimeUTC(timestamp) {
  const d = new Date(timestamp * 1000);
  const pad2 = (val) => (val < 10 ? "0" : "") + val;
  return "{0}:{1}".format(
    pad2(d.getHours()), pad2(d.getMinutes())
  );
}

function toDateUTCMonthName(timestamp) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const d = new Date(timestamp * 1000);
  return "{0}. {1} {2}".format(
    d.getDate(), monthNames[d.getMonth()], d.getFullYear()
  );
}
