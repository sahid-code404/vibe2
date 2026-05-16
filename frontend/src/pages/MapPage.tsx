import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { fadeInUp } from '@/lib/animations';
import api from '@/lib/api';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons
const foodIcon = new Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/685/685352.png', iconSize: [30, 30] });
const hotelIcon = new Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', iconSize: [30, 30] });
const attractionIcon = new Icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684809.png', iconSize: [30, 30] });

function SetView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(center, 13); }, [center]);
  return null;
}

export default function MapPage() {
  const [center, setCenter] = useState<[number, number]>([22.5726, 88.3639]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [attractions, setAttractions] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'food' | 'hotels' | 'attractions'>('all');
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCenter([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    );
  }, []);

  useEffect(() => {
    const [lat, lng] = center;
    api.get('/restaurants/nearby', { params: { lat, lng, limit: 15 } }).then(r => setRestaurants(r.data)).catch(() => {});
    api.get('/hotels/nearby', { params: { lat, lng, limit: 10 } }).then(r => setHotels(r.data)).catch(() => {});
    api.get('/attractions/nearby', { params: { lat, lng, limit: 10 } }).then(r => setAttractions(r.data)).catch(() => {});
  }, [center]);

  const filters = [
    { key: 'all', label: 'All', color: 'white' },
    { key: 'food', label: 'Food', color: 'orange' },
    { key: 'hotels', label: 'Hotels', color: 'blue' },
    { key: 'attractions', label: 'Attractions', color: 'green' },
  ] as const;

  return (
    <div className="min-h-screen relative">
      {/* Filter bar */}
      <motion.div {...fadeInUp} className="absolute top-4 left-4 right-4 z-[1000] flex gap-2">
        {filters.map(f => (
          <button key={f.key} onClick={() => setActiveFilter(f.key)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${activeFilter === f.key ? 'bg-white/15 text-white backdrop-blur-lg border border-white/20' : 'glass text-white/40'}`}>
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* Map */}
      <MapContainer center={center} zoom={13} className="w-full h-screen" zoomControl={false}>
        <SetView center={center} />
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {(activeFilter === 'all' || activeFilter === 'food') && restaurants.map((r: any, i: number) => (
          r.lat && r.lng && <Marker key={`r-${i}`} position={[r.lat, r.lng]} icon={foodIcon} eventHandlers={{ click: () => setSelected(r) }}>
            <Popup><b>{r.name}</b><br/>{r.category}</Popup>
          </Marker>
        ))}

        {(activeFilter === 'all' || activeFilter === 'hotels') && hotels.map((h: any, i: number) => (
          h.lat && h.lng && <Marker key={`h-${i}`} position={[h.lat, h.lng]} icon={hotelIcon} eventHandlers={{ click: () => setSelected(h) }}>
            <Popup><b>{h.name}</b></Popup>
          </Marker>
        ))}

        {(activeFilter === 'all' || activeFilter === 'attractions') && attractions.map((a: any, i: number) => (
          a.lat && a.lng && <Marker key={`a-${i}`} position={[a.lat, a.lng]} icon={attractionIcon} eventHandlers={{ click: () => setSelected(a) }}>
            <Popup><b>{a.name}</b></Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Bottom sheet */}
      {selected && (
        <motion.div initial={{ y: 200 }} animate={{ y: 0 }} className="absolute bottom-24 left-4 right-4 z-[1000] glass-strong rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-sm">{selected.name}</h3>
              <p className="text-white/30 text-xs mt-0.5">{selected.category} • {selected.distance?.toFixed(1)} km away</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-white/30 text-xs">✕</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
