const map = L.map('map').setView([42.361, -71.057], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
}).addTo(map);

const circle = L.circle([42.33129, -71.12641], {
    color: 'green',
    fillColor: '#00843d',
    fillOpacity: 1.0,
    radius: 100
}).addTo(map);
circle.bindPopup("Brookline Hills").openPopup();

// Realtime fetch script

// API URL and Key
const url = "https://api-v3.mbta.com/vehicles";
const apiKey = "e825c48397814b85803c564e2a43d990"; // Replace with your MBTA API key

// Initialize the Leaflet Map
const map = L.map("map").setView([42.3601, -71.0589], 12); // Centered on Boston
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

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
