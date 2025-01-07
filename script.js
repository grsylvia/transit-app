const map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
}).addTo(map);

const marker = L.marker([51.505, -0.09]).addTo(map);
marker.bindPopup('<b>Hello world!</b><br>I am a popup.').openPopup();
