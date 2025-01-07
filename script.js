const map = L.map('map').setView([42.361, -71.057], 13);

L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.{ext}', {
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'
}).addTo(map);

const circle = L.circle([42.33129, -71.12641], {
    color: 'green',
    fillColor: '#00843d',
    fillOpacity: 0.5,
    radius: 100
}).addTo(map);
circle.bindPopup("Brookline Hills").openPopup();
