mapboxgl.accessToken =
  'pk.eyJ1IjoibWFya3NhbWEiLCJhIjoiY2p4YTVuam5nMG5nMjN0bXppMjJsM2VoNCJ9.QJo3hzfokEV8VT_lX7E_nQ';

// Some data to render. The IDs are the NUTS area IDs
const min = 0;
const max = 200;
const data = {
  Zhejiang: 30,
  Henan: 20,
  Hubei: 30,
  Jiangxi: 50,
  Shandong: 60,
  Guangxi: 70,
  Hainan: 80,
  Hunan: 20,
  Guangdong: 90,
  Guizhou: 80,
  Yunnan: 10,
  Chongqin: 10,
  Sichuan: 10,
  Gansu: 10,
  Qinghai: 10,
  Xizang: 10,
  Shangxi: 10,
  Taiwan: 120,
  Xianggang: 10,
  Ningxia: 20,
  Xinjiang: 10,
  Aomen: 10,
  Shanghai: 10,
  Hebei: 50,
  Shanxi: 10,
  Beijing: 200,
  Tianjin: 10,
  Jilin: 70,
  Heilongjiang: 10,
  Neimenggu: 40,
  Liaoning: 20,
  Anhui: 30,
  Fujian: 60,
  Jiangsu: 180
};

// Get the percentage for a value
function getPercentage(value) {
  if (!Number(value)) {
    return 0;
  }

  const totalDiff = max - min,
    valueDiff = value - min;
  let percentage = (valueDiff / totalDiff) * 100;

  percentage = Math.max(percentage, 0);
  percentage = Math.min(percentage, 100);

  return percentage;
}

// Get the color for a value depending on the percentage
const begin = { red: 255, green: 242, blue: 0 };
const end = { red: 237, green: 66, blue: 100 };
function getColor(value) {
  const percentage = getPercentage(value) / 100;

  const red = begin.red + Math.floor(percentage * (end.red - begin.red));
  const green =
    begin.green + Math.floor(percentage * (end.green - begin.green));
  const blue = begin.blue + Math.floor(percentage * (end.blue - begin.blue));

  return `rgb(${red},${green},${blue})`;
}

// Get the categorical color stops for the areas
function getColorStops() {
  const stops = [['no match', '#f2f2f2']];

  Object.keys(data).forEach(id => {
    const value = data[id];

    if (!value || isNaN(value)) {
      return;
    }

    const color = getColor(value, min, max);
    stops.push([id, color]);
  });
  return stops;
}

// Get the height stops for the areas
function getHeightStops() {
  const stops = [['no match', 0]];

  Object.keys(data).forEach(id => {
    const value = data[id];

    if (!value || isNaN(value)) {
      return;
    }

    const percentage = Math.floor(getPercentage(value));
    const height = percentage * 700;
    stops.push([id, height]);
  });

  return stops;
}

// Create the mapbox map
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/ubilabs/ciw7jzkux000i2qnu6blrgeks',
  center: [122, 35],
  zoom: 3
});

map.on('load', () => {
  // Add the NUTS data as a source to use
  map.addSource('ch-7llqt7', {
    type: 'vector',
    url: 'mapbox://marksama.c3itjx6e'
  });

  // Create a layer from the NUTS data
  map.addLayer(
    {
      source: 'ch-7llqt7',
      'source-layer': 'ch-7llqt7',
      id: 'marksama.c3itjx6e',
      type: 'fill-extrusion',
      paint: {
        'fill-extrusion-opacity': 0.75,
        'fill-extrusion-color': {
          property: 'PROVNAME',
          type: 'categorical',
          stops: getColorStops()
        },

        'fill-extrusion-height': {
          property: 'PROVNAME',
          type: 'categorical',
          stops: getHeightStops()
        }
      }
    },

    'waterway-label'
  );

  console.log(map.rendered);

  setTimeout(() => {
    map.easeTo({
      duration: 2000,
      pitch: 45,
      bearing: 10,
      easing: t => {
        return t * (2 - t);
      }
    });
  }, 500);
});
