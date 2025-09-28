import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Componente para manejar clics en el mapa
function LocationMarker({ position, setPosition, onLocationSelect }) {
  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      
      // Hacer geocoding reverso para obtener la dirección
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
        .then(res => res.json())
        .then(data => {
          if (onLocationSelect) {
            onLocationSelect({
              address: data.display_name || `${e.latlng.lat}, ${e.latlng.lng}`,
              lat: e.latlng.lat,
              lng: e.latlng.lng,
              coordinates: `${e.latlng.lat},${e.latlng.lng}`
            });
          }
        })
        .catch(() => {
          if (onLocationSelect) {
            onLocationSelect({
              address: `${e.latlng.lat}, ${e.latlng.lng}`,
              lat: e.latlng.lat,
              lng: e.latlng.lng,
              coordinates: `${e.latlng.lat},${e.latlng.lng}`
            });
          }
        });
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        Ubicación seleccionada: {position[0].toFixed(6)}, {position[1].toFixed(6)}
      </Popup>
    </Marker>
  );
}

export default function MapLocationPicker({ onLocationSelect, initialPosition = null, height = "300px" }) {
  // Coordenadas predeterminadas de Guadalajara, México
  const defaultCenter = [20.6597, -103.3496];
  const [position, setPosition] = useState(initialPosition || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Función para buscar ubicaciones
  const searchLocation = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=mx`
      );
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Error buscando ubicación:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Función para seleccionar una ubicación de los resultados de búsqueda
  const selectSearchResult = (result) => {
    const newPos = [parseFloat(result.lat), parseFloat(result.lon)];
    setPosition(newPos);
    
    if (onLocationSelect) {
      onLocationSelect({
        address: result.display_name,
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        coordinates: `${result.lat},${result.lon}`
      });
    }
    
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <div className="space-y-4">
      {/* Buscador de ubicaciones */}
      <div className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar dirección (ej: Guadalajara, Centro Histórico)"
            className="flex-1 p-3 rounded bg-neutral-600 border border-neutral-500 focus:border-red-500 focus:outline-none text-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                searchLocation(searchQuery);
              }
            }}
          />
          <button
            type="button"
            onClick={() => searchLocation(searchQuery)}
            disabled={isSearching}
            className="bg-red-600 hover:bg-red-500 disabled:bg-gray-600 px-4 py-3 rounded text-white font-medium transition"
          >
            {isSearching ? '🔍' : '🔍 Buscar'}
          </button>
        </div>
        
        {/* Resultados de búsqueda */}
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-neutral-700 border border-neutral-600 rounded max-h-48 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => selectSearchResult(result)}
                className="w-full p-3 text-left hover:bg-neutral-600 border-b border-neutral-600 last:border-b-0 text-white text-sm"
              >
                <div className="font-medium">{result.display_name}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Instrucciones */}
      <div className="text-sm text-gray-400">
        💡 Busca una dirección o haz clic directamente en el mapa para seleccionar la ubicación
      </div>

      {/* Mapa */}
      <div style={{ height }} className="rounded-lg overflow-hidden border border-neutral-600">
        <MapContainer
          center={position || defaultCenter}
          zoom={position ? 16 : 12}
          style={{ height: '100%', width: '100%' }}
          key={position ? `${position[0]}-${position[1]}` : 'default'} // Force re-render cuando cambie la posición
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker 
            position={position} 
            setPosition={setPosition}
            onLocationSelect={onLocationSelect}
          />
        </MapContainer>
      </div>

      {/* Información de la ubicación seleccionada */}
      {position && (
        <div className="p-3 bg-green-600/20 border border-green-500 rounded text-green-300 text-sm">
          📍 Ubicación seleccionada: {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </div>
      )}
    </div>
  );
}