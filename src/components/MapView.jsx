import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';



// ======================
// FIX LEAFLET ICON
// ======================
import iconMarker2x from 'leaflet/dist/images/marker-icon-2x.png';
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconMarker2x,
  iconUrl: iconMarker,
  shadowUrl: iconShadow,
});

// ======================
// MAP UPDATER
// ======================
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { duration: 1.2 });
  }, [center, map]);
  return null;
}

// ======================
// MAIN COMPONENT
// ======================
export default function MapView({ position, speed, className, route }) {
  const center = [position.latitude, position.longitude];
  const [routePath, setRoutePath] = useState([]);

  // ======================
  // FETCH REAL ROUTE
  // ======================
  useEffect(() => {
    const fetchRoute = async () => {
      const url = `https://router.project-osrm.org/route/v1/driving/` +
        `${route.from.lng},${route.from.lat};${route.to.lng},${route.to.lat}` +
        `?overview=full&geometries=geojson`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.routes?.length) {
        const coords = data.routes[0].geometry.coordinates;

        // OSRM trả [lng, lat] → đảo lại
        const leafletCoords = coords.map(([lng, lat]) => [lat, lng]);
        setRoutePath(leafletCoords);
      }
    };

    fetchRoute();
  }, []);

  return (
    <div className={`h-full w-full rounded-xl overflow-hidden ${className}`}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* ===== REAL ROAD ROUTE ===== */}
        {routePath.length > 0 && (
          <Polyline
            positions={routePath}
            pathOptions={{ color: '#2563eb', weight: 4, opacity: 0.8 }}
          />
        )}

        {/* START / END */}
        <Marker position={[route.from.lat, route.from.lng]}>
          <Popup>Start</Popup>
        </Marker>

        <Marker position={[route.to.lat, route.to.lng]}>
          <Popup>End</Popup>
        </Marker>

        {/* CURRENT POSITION */}
        <Marker position={center}>
          <Popup>
            <strong>Current Position</strong><br />
            Speed: {speed} km/h
          </Popup>
        </Marker>

        <MapUpdater center={center} />
      </MapContainer>
    </div>
  );
}
