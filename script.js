const map = L.map('map').setView([42.361, -71.057], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
}).addTo(map);

const circle = L.circle([42.33129, -71.12641], {
    color: 'green',
    fillColor: '#00843d',
    fillOpacity: 0.5,
    radius: 100
}).addTo(map);
circle.bindPopup("Brookline Hills").openPopup();
