
function getCoordFilter(name) {
  switch(name) {
    case "":
      return (coord) => true;
    case "Berlin":
      return (coord) => {
        return 52.40 < coord[0] && coord[0] < 52.61 &&
                13.23 < coord[1] && coord[1] < 13.56;
      };
    case "Barcelona":
      return (coord) => {
        return 41.26 < coord[0] && coord[0] < 41.45 &&
                2.00 < coord[1] && coord[1] < 2.29;
      };
    default:
      console.warn("Unknown coordinate filter:", name);
      return (coord) => true;
  }
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
    d.getFullYear(), pad2(d.getMonth()), pad2(d.getDate())
  );
}

function toTimeUTC(timestamp) {
  const d = new Date(timestamp * 1000);
  const pad2 = (val) => (val < 10 ? "0" : "") + val;
  return "{0}:{1}".format(
    pad2(d.getHours()), pad2(d.getMinutes())
  );
}
