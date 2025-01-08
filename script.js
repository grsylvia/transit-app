const map = L.map('map').setView([42.361, -71.057], 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// Function to load CSV file and add markers
function loadTrainStations(csvData) {
  var stationLayer = L.layerGroup().addTo(map); // Create a layer group to hold all markers

  // Parse CSV
  Papa.parse(csvData, {
    complete: function(results) {
      results.data.forEach(function(station) {
        var lat = parseFloat(station.stop_lat); // Use 'stop_lat' for latitude
        var lng = parseFloat(station.stop_lon); // Use 'stop_lon' for longitude
        if (!isNaN(lat) && !isNaN(lng)) {
          // Create a marker and add it to the layer group
          L.marker([lat, lng]).addTo(stationLayer)
            .bindPopup('<b>' + station.stop_name + '</b>'); // Use 'stop_name' for the popup
        }
      });
    }
  });
}

// Example GitHub CSV URL (raw file)
var csvUrl = 'https://raw.githubusercontent.com/grsylvia/transit-app/refs/heads/main/stops.csv'; // Replace with your actual raw GitHub CSV URL

fetch(csvUrl)
  .then(response => response.text())
  .then(data => loadTrainStations(data));


// API URL and Key
const url = "https://api-v3.mbta.com/vehicles?filter[route]=Green-B,Green-C,Green-D,Green-E";
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

// Refresh Data Every 5 seconds
fetchAndDisplayVehicles();
setInterval(fetchAndDisplayVehicles, 5000);

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
