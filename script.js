const map = L.map('map').setView([42.361, -71.057], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
}).addTo(map);

var mbtaicon = L.icon({
    iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/64/MBTA.svg',
    iconSize: [10, 10]
});

L.marker([42.33129, -71.12641], {icon: mbtaicon}).addTo(map);

const circle = L.circle([42.33129, -71.12641], {
    color: 'green',
    fillColor: '#00843d',
    fillOpacity: 0.5,
    radius: 100
}).addTo(map);
circle.bindPopup("Brookline Hills").openPopup();

const geojsonUrl = "https://raw.githubusercontent.com/grsylvia/transit-app/main/path-to/mbta_subway_layer.geojson";

fetch(geojsonUrl)
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data).addTo(map);
  })
  .catch(err => console.error(err));






