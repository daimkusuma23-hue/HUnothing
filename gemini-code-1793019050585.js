// INISIALISASI JAM & TANGGAL
function updateClock() {
    const now = new Date();
    
    // Jam Format HH:MM
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('digital-clock').innerText = `${hours}:${minutes}`;

    // Tanggal Indonesia
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').innerText = now.toLocaleDateString('id-ID', options);
}
setInterval(updateClock, 1000);
updateClock();

// INISIALISASI PETA LEAFLET & GPS
let map = L.map('map', { zoomControl: false, attributionControl: false }).setView([-0.9471, 100.4172], 14);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19
}).addTo(map);

let userMarker = null;

// Lacak GPS Realtime dari Head Unit
if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const speedMs = position.coords.speed; // meter per detik
        const speedKmh = speedMs ? Math.round(speedMs * 3.6) : 0;

        document.getElementById('speed-val').innerText = speedKmh;

        const latLng = [lat, lng];
        map.setView(latLng, 15);

        if (!userMarker) {
            const redDotIcon = L.divIcon({
                className: 'custom-gps-dot',
                html: '<div style="width: 16px; height: 16px; background: #D71921; border: 3px solid #fff; border-radius: 50%; box-shadow: 0 0 10px #D71921;"></div>',
                iconSize: [16, 16]
            });
            userMarker = L.marker(latLng, { icon: redDotIcon }).addTo(map);
        } else {
            userMarker.setLatLng(latLng);
        }
    }, function(error) {
        console.warn("GPS belum aktif atau izin ditolak.");
    }, { enableHighAccuracy: true });
}

function recenterMap() {
    if (userMarker) {
        map.setView(userMarker.getLatLng(), 16);
    }
}

// FULLSCREEN TOGGLE
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            alert(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}