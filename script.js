const map = L.map('map').setView([42.361, -71.057], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
}).addTo(map);

const marker = L.marker([42.361, -71.057]).addTo(map);
marker.bindPopup('<b>Hello world!</b><br>I am a popup.').openPopup();
