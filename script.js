const map = L.map('map').setView([42.361, -71.057], 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// Define the custom icon
var customIcon = L.icon({
  iconUrl: 'https://github.com/grsylvia/transit-app/blob/main/Icon-mode-subway-default.png', // Replace with your actual raw GitHub icon URL
  iconSize: [25, 25], // Size of the icon [width, height]
  iconAnchor: [12, 12], // Anchor point of the icon (centered at the lat/lng position)
  popupAnchor: [0, -12] // Offset the popup to appear above the icon
});

// Function to load CSV file and add custom icons
function loadTrainStations(csvData) {
  var stationLayer = L.layerGroup().addTo(map);

  Papa.parse(csvData, {
    header: true,
    dynamicTyping: true,
    complete: function(results) {
      results.data.forEach(function(station) {
        var lat = station.stop_lat;
        var lng = station.stop_lon;
        var name = station.stop_name;

        if (!isNaN(lat) && !isNaN(lng)) {
          // Create a marker with the custom icon and add a popup with the station name
          L.marker([lat, lng], { icon: customIcon })
            .addTo(stationLayer)
            .bindPopup('<b>' + name + '</b>'); // Show the station name in the popup
        }
      });
    }
  });
}

// GitHub CSV URL
var csvUrl = 'https://raw.githubusercontent.com/grsylvia/transit-app/refs/heads/main/stops_rapidtransit.csv'; // Replace with your actual raw GitHub CSV URL

fetch(csvUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }
    return response.text();
  })
  .then(data => {
    loadTrainStations(data);
  })
  .catch(error => console.error("Error fetching CSV file:", error));

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
