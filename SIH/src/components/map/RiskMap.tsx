import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Habitation, RelocationSite } from '../../types';
import { VillagePopup } from './VillagePopup';
import { MapControls } from './MapControls';
import { MapLegend } from './MapLegend';
import { BaseLayerControl } from './BaseLayerControl';
import { useMapStore } from '../../store/mapStore';
import type { BaseLayerType } from '../../store/mapStore';

interface RiskMapProps {
  habitations: Habitation[];
  sites: RelocationSite[];
  height?: string;
  showControls?: boolean;
}

// Controller component to smoothly center map on state updates and invalidate Leaflet layout size
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();

  React.useEffect(() => {
    map.setView(center, zoom, { animate: true });
    
    // Invalidate size to ensure Leaflet renders tiles across the full container width/height
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => clearTimeout(timer);
  }, [center, zoom, map]);

  React.useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [map]);

  return null;
};

// Tile Layer Configuration Provider
const getTileLayerConfig = (baseLayer: BaseLayerType) => {
  switch (baseLayer) {
    case 'satellite':
      return {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18
      };
    case 'terrain':
      return {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      };
    case 'vector':
    default:
      return {
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap contributors',
        maxZoom: 19
      };
  }
};

// DivIcon Generator for Habitation Pins
const createHabitationIcon = (status: Habitation['riskStatus']) => {
  let colorClass = 'bg-emerald-500 border-white';
  let pulseClass = '';
  if (status === 'CRITICAL') {
    colorClass = 'bg-rose-600 border-white';
    pulseClass = 'marker-pulse-critical';
  } else if (status === 'HIGH') {
    colorClass = 'bg-amber-500 border-white';
    pulseClass = 'marker-pulse-high';
  } else if (status === 'MODERATE') {
    colorClass = 'bg-yellow-500 border-white';
  }

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div className="relative flex items-center justify-center w-8 h-8 ${pulseClass}">
        <div className="w-7 h-7 rounded-full ${colorClass} border-2 shadow-2xl flex items-center justify-center text-white text-[10px] font-extrabold ring-2 ring-slate-900/30">
          ${status === 'CRITICAL' ? '⚠️' : status === 'HIGH' ? '⚡' : '●'}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

// DivIcon Generator for Relocation Sites
const createSiteIcon = (code: string) => {
  return L.divIcon({
    className: 'custom-site-marker',
    html: `
      <div className="flex items-center justify-center px-2 py-1 rounded-lg bg-indigo-600 border-2 border-white shadow-2xl text-white font-bold text-[10px] space-x-1 whitespace-nowrap ring-2 ring-slate-900/40">
        <span>🏗️</span>
        <span>${code}</span>
      </div>
    `,
    iconSize: [52, 24],
    iconAnchor: [26, 12],
    popupAnchor: [0, -12]
  });
};

export const RiskMap: React.FC<RiskMapProps> = ({
  habitations,
  sites,
  height = 'h-[600px]',
  showControls = true
}) => {
  const { layers, activeBaseLayer, mapCenter, zoomLevel } = useMapStore();
  const tileConfig = getTileLayerConfig(activeBaseLayer);

  return (
    <div className={`relative w-full ${height} rounded-xl overflow-hidden shadow-lg border border-slate-200 z-0`}>
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <MapController center={mapCenter} zoom={zoomLevel} />

        {/* Dynamic Base Tile Layer */}
        <TileLayer
          key={activeBaseLayer}
          url={tileConfig.url}
          attribution={tileConfig.attribution}
          maxZoom={tileConfig.maxZoom}
        />

        {/* Flood Inundation Overlay Circles */}
        {layers.flood &&
          habitations
            .filter((h) => h.hazardScores.flood > 60)
            .map((h) => (
              <CircleMarker
                key={`flood-${h.id}`}
                center={h.coordinates}
                radius={h.hazardScores.flood / 3.5}
                pathOptions={{
                  color: '#2563eb',
                  fillColor: '#3b82f6',
                  fillOpacity: 0.4,
                  weight: 2.5
                }}
              />
            ))}

        {/* Landslide Risk Overlay Circles */}
        {layers.landslide &&
          habitations
            .filter((h) => h.hazardScores.landslide > 60)
            .map((h) => (
              <CircleMarker
                key={`landslide-${h.id}`}
                center={h.coordinates}
                radius={h.hazardScores.landslide / 3}
                pathOptions={{
                  color: '#e11d48',
                  fillColor: '#f43f5e',
                  fillOpacity: 0.35,
                  weight: 2.5
                }}
              />
            ))}

        {/* Habitation Pins */}
        {habitations.map((habitation) => (
          <Marker
            key={habitation.id}
            position={habitation.coordinates}
            icon={createHabitationIcon(habitation.riskStatus)}
          >
            <Popup>
              <VillagePopup habitation={habitation} />
            </Popup>
          </Marker>
        ))}

        {/* Relocation Sites Pins */}
        {layers.candidateSites &&
          sites.map((site) => (
            <Marker
              key={site.id}
              position={site.coordinates}
              icon={createSiteIcon(site.code)}
            >
              <Popup>
                <div className="w-56 p-3 font-sans">
                  <div className="flex items-center justify-between border-b pb-1 mb-2">
                    <span className="font-bold text-xs text-indigo-700">{site.code}</span>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                      {site.suitability}% Suitable
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 mb-1">{site.name}</h5>
                  <p className="text-[10px] text-slate-500 mb-2">
                    Capacity: {site.assignedCount} / {site.totalCapacity} persons
                  </p>
                  <div className="text-[10px] font-semibold text-slate-700 space-y-0.5">
                    <div>Soil: {site.soilType}</div>
                    <div>Highway Proximity: {site.nearestHighwayKm} km</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* Map Overlay Floating Control Widgets */}
      {showControls && (
        <>
          <div className="absolute top-3 left-12 sm:top-4 sm:left-14 z-[1000]">
            <BaseLayerControl />
          </div>
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[1000]">
            <MapControls />
          </div>
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-[1000]">
            <MapLegend />
          </div>
        </>
      )}
    </div>
  );
};

