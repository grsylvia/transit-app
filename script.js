const map = L.map('map').setView([42.361, -71.057], 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
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

// Realtime fetch script

// API URL and Key
const url = "https://api-v3.mbta.com/vehicles";
const apiKey = "e825c48397814b85803c564e2a43d990";

// Function to Fetch and Display Data
async function fetchAndDisplayVehicles() {
  try {
    const response = await fetch(`${url}?api_key=${apiKey}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer.options && layer.options.pane === "markerPane") {
        map.removeLayer(layer);
      }
    });

    // Add vehicle markers to the map
    data.data.forEach((vehicle) => {
      const { latitude, longitude } = vehicle.attributes;
      const vehicleId = vehicle.id;
      const popupContent = `
        <b>Vehicle ID:</b> ${vehicleId}<br>
        <b>Status:</b> ${vehicle.attributes.current_status}<br>
        <b>Speed:</b> ${vehicle.attributes.speed || "N/A"} mph
      `;
      L.marker([latitude, longitude]).addTo(map).bindPopup(popupContent);
    });
  } catch (error) {
    console.error("Error fetching MBTA data:", error);
  }
}

// Refresh Data Every 2 mins
fetchAndDisplayVehicles();
setInterval(fetchAndDisplayVehicles, 120000);

// Fetch and add the GeoJSON layer
fetch('https://grsylvia.github.io/transit-app/mbta_subway_layer.geojson') // Update with your hosted file's URL
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function (feature) {
                return {
                    color: "purple",
                    weight: 2,
                    opacity: 0.8
                };
            },
            onEachFeature: function (feature, layer) {
                if (feature.properties && feature.properties.name) {
                    layer.bindPopup(`Subway Line: ${feature.properties.name}`);
                }
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error loading GeoJSON:', error));
