const map = L.map('map').setView([42.361, -71.057], 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);


// Function to load CSV file and add circles
function loadTrainStations(csvData) {
  var stationLayer = L.layerGroup().addTo(map);

  Papa.parse(csvData, {
    header: true,
    dynamicTyping: true,
    complete: function(results) {
      console.log("Parsed Data:", results.data);
      results.data.forEach(function(station) {
        var lat = station.stop_lat;
        var lng = station.stop_lon;
        if (!isNaN(lat) && !isNaN(lng)) {
          // Create a circle and add it to the layer group
          L.circle([lat, lng], {
            color: 'blue', // Outline color
            fillColor: '#1E90FF', // Fill color
            fillOpacity: 0.5, // Opacity of the fill
            radius: 50 // Radius in meters
          }).addTo(stationLayer);
        }
      });
    },
    error: function(error) {
      console.error("Error parsing CSV:", error);
    }
  });
}

// GitHub CSV URL
var csvUrl = 'https://raw.githubusercontent.com/grsylvia/transit-app/refs/heads/main/stops_rapidtransit.csv';

fetch(csvUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }
    return response.text();
  })
  .then(data => {
    console.log("CSV Data:", data); // Debug fetched CSV content
    loadTrainStations(data);
  })
  .catch(error => console.error("Error fetching CSV file:", error));

// API URL and Key
const url = "https://api-v3.mbta.com/vehicles?filter[route_type]=Green-B,Green-C,Green-D,Green-E";
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
                    color: "green",
                    weight: 3,
                    opacity: 1.0
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
