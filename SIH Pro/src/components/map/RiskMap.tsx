import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Polyline,
  GeoJSON,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type {
  Habitation,
  RelocationSite,
  CWCGaugeStation,
  IMDRainfallStation,
  HistoricalFloodRecord
} from '../../types';
import { VillagePopup } from './VillagePopup';
import { MapControls } from './MapControls';
import { MapLegend } from './MapLegend';
import { BaseLayerControl } from './BaseLayerControl';
import { useMapStore } from '../../store/mapStore';
import type { BaseLayerType, ForecastHorizon } from '../../store/mapStore';
import { apiService } from '../../services/api';
import { Zap, Clock, Calendar, Crosshair, RotateCcw, Plus, Minus } from 'lucide-react';

interface RiskMapProps {
  habitations: Habitation[];
  sites: RelocationSite[];
  height?: string;
  showControls?: boolean;
}

// ── River Network Geometries ────────────────────────────────────────────────
const RIVER_NETWORKS = [
  {
    name: 'Godavari Main Trunk',
    basin: 'Godavari',
    color: '#38bdf8',
    weight: 3.5,
    coords: [
      [19.997, 73.789], [19.890, 74.490], [19.535, 74.834], [19.519, 74.383],
      [19.200, 76.366], [19.016, 76.716], [19.183, 77.033], [19.150, 77.310],
      [19.035, 77.467], [18.712, 77.525], [18.546, 77.578], [19.685, 79.789],
      [19.417, 79.972]
    ]
  },
  {
    name: 'Krishna River Basin',
    basin: 'Krishna',
    color: '#0284c7',
    weight: 3.5,
    coords: [
      [17.923, 73.659], [17.700, 73.850], [17.400, 74.050], [17.100, 74.250],
      [16.850, 74.580], [16.690, 74.460], [16.580, 74.600], [16.350, 74.800],
      [16.100, 75.100]
    ]
  },
  {
    name: 'Bhima River Trunk',
    basin: 'Krishna',
    color: '#60a5fa',
    weight: 2.5,
    coords: [
      [19.072, 73.535], [18.800, 73.800], [18.600, 74.100], [18.350, 74.500],
      [18.150, 74.800], [17.650, 75.900], [17.300, 76.200], [16.700, 77.100]
    ]
  },
  {
    name: 'Tapi River Basin',
    basin: 'Tapi',
    color: '#06b6d4',
    weight: 3.0,
    coords: [
      [21.500, 76.200], [21.350, 75.800], [21.200, 75.300], [21.050, 74.750],
      [21.150, 74.200], [21.250, 73.800], [21.300, 73.200]
    ]
  },
  {
    name: 'Wainganga River (Vidarbha)',
    basin: 'Godavari',
    color: '#22d3ee',
    weight: 3.0,
    coords: [
      [21.800, 79.800], [21.400, 79.900], [21.000, 79.950], [20.600, 79.850],
      [20.200, 79.750], [19.800, 79.800], [19.417, 79.972]
    ]
  },
  {
    name: 'Wardha River',
    basin: 'Godavari',
    color: '#38bdf8',
    weight: 2.5,
    coords: [
      [21.600, 78.400], [21.200, 78.500], [20.700, 78.600], [20.300, 78.800],
      [19.800, 79.100], [19.685, 79.789]
    ]
  },
  {
    name: 'Penganga River',
    basin: 'Godavari',
    color: '#818cf8',
    weight: 2.0,
    coords: [
      [20.300, 76.200], [19.900, 76.800], [19.600, 77.400], [19.500, 78.200],
      [19.700, 78.800], [19.800, 79.100]
    ]
  },
  {
    name: 'Koyna River',
    basin: 'Krishna',
    color: '#3b82f6',
    weight: 2.0,
    coords: [
      [17.650, 73.750], [17.400, 73.720], [17.300, 73.850], [17.300, 74.150]
    ]
  }
];

// Helper: Generate realistic organic multi-harmonic polygon footprints
function generateOrganicFootprint(
  lat: number,
  lng: number,
  radiusKm: number,
  vertices = 32
): [number, number][] {
  const points: [number, number][] = [];
  const seed = (Math.abs(lat * 1000) + Math.abs(lng * 1000)) % 100;
  const kmPerLatDegree = 111.0;
  const kmPerLngDegree = 111.0 * Math.cos((lat * Math.PI) / 180.0);

  for (let i = 0; i < vertices; i++) {
    const angle = (i * 2 * Math.PI) / vertices;
    const h1 = Math.sin(angle * 3 + seed * 0.1) * 0.22;
    const h2 = Math.cos(angle * 5 + seed * 0.2) * 0.15;
    const h3 = Math.sin(angle * 7 + seed * 0.3) * 0.08;
    const r = radiusKm * (1.0 + h1 + h2 + h3);

    const dLat = (r * Math.cos(angle)) / kmPerLatDegree;
    const dLng = (r * Math.sin(angle)) / kmPerLngDegree;
    points.push([lat + dLat, lng + dLng]);
  }
  return points;
}

// Controller component to smoothly adjust center and zoom
const MapViewController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

// Custom Zoom and Navigation Buttons Component
const MapNavControls: React.FC<{
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFocusRisk: () => void;
  onReset: () => void;
}> = ({ onZoomIn, onZoomOut, onFocusRisk, onReset }) => {
  return (
    <div className="flex flex-col gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1 shadow-2xl">
      <button
        onClick={onZoomIn}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        title="Zoom In"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        onClick={onZoomOut}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        title="Zoom Out"
      >
        <Minus className="w-4 h-4" />
      </button>
      <div className="w-full h-px bg-slate-800 my-0.5"></div>
      <button
        onClick={onFocusRisk}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-rose-400 hover:text-white hover:bg-rose-600 transition-colors"
        title="Focus Active Risk Zones"
      >
        <Crosshair className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={onReset}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-sky-400 hover:text-white hover:bg-sky-600 transition-colors"
        title="Reset Maharashtra State View"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

// Basemap URL and Attribution Provider
const getTileLayerConfig = (baseLayer: BaseLayerType) => {
  switch (baseLayer) {
    case 'satellite':
      return {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19
      };
    case 'terrain':
      return {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
        maxZoom: 19
      };
    case 'vector':
    default:
      return {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap contributors',
        maxZoom: 19
      };
  }
};

export const RiskMap: React.FC<RiskMapProps> = ({
  habitations,
  sites,
  height = 'h-[600px]',
  showControls = true
}) => {
  const {
    layers,
    activeBaseLayer,
    forecastHorizon,
    setForecastHorizon,
    mapCenter,
    zoomLevel
  } = useMapStore();

  const tileConfig = getTileLayerConfig(activeBaseLayer);

  // Live Model Datasets
  const [cwcStations, setCwcStations] = useState<CWCGaugeStation[]>([]);
  const [rainfallStations, setRainfallStations] = useState<IMDRainfallStation[]>([]);
  const [historicalFloods, setHistoricalFloods] = useState<HistoricalFloodRecord[]>([]);
  const [districtGeoJson, setDistrictGeoJson] = useState<any>(null);

  // Map instance ref
  const mapRef = useRef<L.Map | null>(null);

  // Fetch live model data on mount or horizon change
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [stations, rainSt, floodEvents, riskMap] = await Promise.all([
          apiService.getStations(),
          apiService.getRainfallStations(),
          apiService.getHistoricalFloodEvents(),
          apiService.getRiskMap(forecastHorizon)
        ]);
        if (isMounted) {
          setCwcStations(stations);
          setRainfallStations(rainSt);
          setHistoricalFloods(floodEvents);
          if (riskMap && riskMap.type === 'FeatureCollection') {
            setDistrictGeoJson(riskMap);
          }
        }
      } catch (err) {
        console.warn('RiskMap: live data fetch failed, fallback active', err);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [forecastHorizon]);

  // Compute probability for a location based on active horizon
  const getProbability = (station: CWCGaugeStation) => {
    if (forecastHorizon === '6h' && station.probability_6h !== undefined) return station.probability_6h;
    if (forecastHorizon === '12h' && station.probability_12h !== undefined) return station.probability_12h;
    if (station.probability_24h !== undefined) return station.probability_24h;
    return 0.25;
  };

  const getRiskTier = (prob: number) => {
    if (prob >= 0.80) return { label: 'EXTREME', color: '#f43f5e', fill: '#e11d48', opacity: 0.55 };
    if (prob >= 0.60) return { label: 'HIGH', color: '#f97316', fill: '#ea580c', opacity: 0.45 };
    if (prob >= 0.30) return { label: 'MODERATE', color: '#eab308', fill: '#ca8a04', opacity: 0.35 };
    return { label: 'LOW', color: '#10b981', fill: '#059669', opacity: 0.25 };
  };

  const highestRiskStation = useMemo(() => {
    if (!cwcStations.length) return null;
    return [...cwcStations].sort((a, b) => getProbability(b) - getProbability(a))[0];
  }, [cwcStations, forecastHorizon]);

  const maxProb = highestRiskStation ? getProbability(highestRiskStation) : 0;
  const extremeCount = cwcStations.filter((s) => getProbability(s) >= 0.80).length;

  // Zoom to highest risk stations
  const handleFocusRiskAreas = () => {
    if (!mapRef.current) return;
    const extremeStations = cwcStations.filter((s) => getProbability(s) >= 0.60);
    if (extremeStations.length > 0) {
      const bounds = L.latLngBounds(extremeStations.map((s) => [s.latitude, s.longitude]));
      mapRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 11 });
    } else if (highestRiskStation) {
      mapRef.current.flyTo([highestRiskStation.latitude, highestRiskStation.longitude], 10);
    }
  };

  // Reset to Maharashtra State overview
  const handleResetMaharashtra = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo([19.3, 76.2], 7, { duration: 1.0 });
  };

  // Marker Icon Generators
  const createCWCIcon = (station: CWCGaugeStation) => {
    const prob = getProbability(station);
    const tier = getRiskTier(prob);
    const isExtreme = prob >= 0.80;

    return L.divIcon({
      className: 'cwc-gauge-icon',
      html: `
        <div class="relative flex items-center justify-center">
          ${isExtreme ? `<div class="absolute w-7 h-7 rounded-full animate-ping" style="background-color: ${tier.color}; opacity: 0.5;"></div>` : ''}
          <div class="w-5 h-5 rounded-full border-2 border-white shadow-md flex items-center justify-center font-bold text-white text-[9px]" style="background-color: ${tier.color};">
            💧
          </div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10]
    });
  };

  const createRainfallIcon = (station: IMDRainfallStation) => {
    const rain = station.daily_actual_mm;
    const color = rain > 150 ? '#ec4899' : rain > 80 ? '#6366f1' : '#3b82f6';

    return L.divIcon({
      className: 'rain-station-icon',
      html: `
        <div class="w-4 h-4 rounded-full border border-white shadow-sm flex items-center justify-center text-white text-[8px]" style="background-color: ${color};" title="${station.district}: ${rain}mm">
          🌧
        </div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      popupAnchor: [0, -8]
    });
  };

  const createHistoricalFloodIcon = () => {
    return L.divIcon({
      className: 'hist-flood-icon',
      html: `
        <div class="w-6 h-6 rounded-lg bg-amber-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[11px] font-bold">
          ⚠️
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12]
    });
  };

  const createRelocationSiteIcon = (code: string) => {
    return L.divIcon({
      className: 'relocation-site-icon',
      html: `
        <div class="px-1.5 py-0.5 rounded-md bg-emerald-600 border border-white shadow-md text-white text-[9px] font-bold flex items-center gap-0.5">
          <span>🛡️</span>
          <span>${code}</span>
        </div>
      `,
      iconSize: [48, 20],
      iconAnchor: [24, 10],
      popupAnchor: [0, -10]
    });
  };

  return (
    <div className={`relative w-full ${height} rounded-xl overflow-hidden shadow-2xl border border-slate-700/80 z-0 bg-slate-950`}>
      {/* ── Forecast Horizon Selector (Top-Center HUD) ─────────────────────── */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-1.5 shadow-2xl flex items-center gap-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 hidden sm:inline">
          Forecast Horizon:
        </span>
        {(['6h', '12h', '24h'] as ForecastHorizon[]).map((horizon) => {
          const isActive = forecastHorizon === horizon;
          return (
            <button
              key={horizon}
              onClick={() => setForecastHorizon(horizon)}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {horizon === '6h' && <Zap className="w-3 h-3 text-amber-300" />}
              {horizon === '12h' && <Clock className="w-3 h-3 text-sky-300" />}
              {horizon === '24h' && <Calendar className="w-3 h-3 text-indigo-300" />}
              <span>{horizon.toUpperCase()}</span>
            </button>
          );
        })}
      </div>

      {/* ── Extreme Risk Warning Banner (Top-Center underneath) ─────────────── */}
      {extremeCount > 0 && highestRiskStation && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-[990] bg-rose-950/90 backdrop-blur-md border border-rose-500/70 text-white rounded-full px-4 py-1.5 shadow-2xl flex items-center gap-3 animate-in fade-in duration-200">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          <span className="text-xs font-extrabold tracking-wide">
            ALERT: {extremeCount} EXTREME FLOOD RISK AREA{extremeCount > 1 ? 'S' : ''} (Max: {Math.round(maxProb * 100)}%)
          </span>
          <button
            onClick={() => {
              if (mapRef.current) {
                mapRef.current.flyTo([highestRiskStation.latitude, highestRiskStation.longitude], 10);
              }
            }}
            className="text-[10px] uppercase font-bold tracking-wider underline hover:text-rose-200"
          >
            Locate {highestRiskStation.station} &rarr;
          </button>
        </div>
      )}

      {/* ── Leaflet Map Container ────────────────────────────────────────── */}
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        zoomControl={false}
        className="w-full h-full"
        ref={mapRef}
      >
        <TileLayer
          url={tileConfig.url}
          attribution={tileConfig.attribution}
          maxZoom={tileConfig.maxZoom}
        />

        <MapViewController center={mapCenter} zoom={zoomLevel} />

        {/* ── District Administrative Boundaries ──────────────────────────── */}
        {layers.districtBoundaries && districtGeoJson && (
          <GeoJSON
            key="districts-geojson"
            data={districtGeoJson}
            style={() => ({
              color: '#64748b',
              weight: 1.2,
              opacity: 0.65,
              fillColor: 'transparent',
              fillOpacity: 0.0,
              dashArray: '3, 4'
            })}
            onEachFeature={(feature, layer) => {
              if (feature.properties) {
                const name = feature.properties.district || feature.properties.dtname || 'District';
                layer.bindTooltip(
                  `<div class="text-[10px] font-semibold text-slate-200 px-1 py-0.5">${name}</div>`,
                  { permanent: false, direction: 'center', className: 'district-tooltip' }
                );
              }
            }}
          />
        )}

        {/* ── Maharashtra River Network ──────────────────────────────────── */}
        {layers.riverNetwork &&
          RIVER_NETWORKS.map((river) => (
            <Polyline
              key={river.name}
              positions={river.coords as [number, number][]}
              pathOptions={{
                color: river.color,
                weight: river.weight,
                opacity: 0.85,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            >
              <Popup>
                <div className="text-xs p-1">
                  <strong className="text-sky-600 block">{river.name}</strong>
                  <span className="text-slate-500 text-[10px]">Basin: {river.basin}</span>
                </div>
              </Popup>
            </Polyline>
          ))}

        {/* ── Localized Multi-Harmonic Flood Hazard Footprints ─────────────── */}
        {layers.flood &&
          cwcStations.map((st) => {
            const prob = getProbability(st);
            if (prob < 0.30) return null;

            const tier = getRiskTier(prob);
            const baseRadiusKm = prob >= 0.80 ? 12.0 : prob >= 0.60 ? 8.0 : 5.0;
            const outerCoords = generateOrganicFootprint(st.latitude, st.longitude, baseRadiusKm, 32);
            const innerCoords = generateOrganicFootprint(st.latitude, st.longitude, baseRadiusKm * 0.45, 24);

            return (
              <React.Fragment key={`hazard-${st.station}-${forecastHorizon}`}>
                {/* Outer Buffer Footprint */}
                <Polygon
                  positions={outerCoords}
                  pathOptions={{
                    color: tier.color,
                    weight: 1.5,
                    fillColor: tier.fill,
                    fillOpacity: tier.opacity * 0.4,
                    dashArray: '4, 4'
                  }}
                />
                {/* Inner Core Inundation Zone */}
                <Polygon
                  positions={innerCoords}
                  pathOptions={{
                    color: tier.color,
                    weight: 2,
                    fillColor: tier.fill,
                    fillOpacity: tier.opacity
                  }}
                >
                  <Popup>
                    <div className="w-56 p-2 font-sans text-xs">
                      <div className="flex items-center justify-between border-b pb-1 mb-2">
                        <span className="font-bold text-slate-800">{st.station} Zone</span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white uppercase"
                          style={{ backgroundColor: tier.color }}
                        >
                          {tier.label}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-1 text-[11px] mb-2">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Forecast Horizon:</span>
                          <strong className="text-blue-600 uppercase font-mono">{forecastHorizon}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Flood Probability:</span>
                          <strong className="text-slate-800 font-bold">{Math.round(prob * 100)}%</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Latest Discharge:</span>
                          <span className="font-mono text-slate-700">{st.latest_discharge ?? 'N/A'} cumec</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Max Capacity:</span>
                          <span className="font-mono text-rose-600 font-bold">{st.max_discharge ?? 'N/A'} cumec</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic">
                        * High-resolution hydrological prediction footprint.
                      </p>
                    </div>
                  </Popup>
                </Polygon>
              </React.Fragment>
            );
          })}

        {/* ── Central Water Commission (CWC) Telemetry Gauges ────────────── */}
        {layers.riverStations &&
          cwcStations.map((station) => {
            const prob = getProbability(station);
            const tier = getRiskTier(prob);

            return (
              <Marker
                key={`cwc-${station.station}`}
                position={[station.latitude, station.longitude]}
                icon={createCWCIcon(station)}
              >
                <Popup>
                  <div className="w-64 p-3 font-sans">
                    <div className="flex items-center justify-between border-b pb-1.5 mb-2">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 leading-tight">{station.station}</h4>
                        <span className="text-[10px] text-slate-500">River {station.river} • {station.district}</span>
                      </div>
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white uppercase ml-1 flex-shrink-0"
                        style={{ backgroundColor: tier.color }}
                      >
                        {tier.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 mb-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Discharge</span>
                        <strong className="font-mono text-slate-800">{station.latest_discharge ?? 'N/A'} cumec</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Historical Peak</span>
                        <strong className="font-mono text-rose-600">{station.max_discharge ?? 'N/A'} cumec</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">24h Rainfall</span>
                        <strong className="font-mono text-blue-600">{station.rainfall_24h_mm ?? 0} mm</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Discharge Ratio</span>
                        <strong className="font-mono text-slate-800">
                          {station.max_discharge ? Math.round((station.latest_discharge / station.max_discharge) * 100) : 0}%
                        </strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                      <span className="text-slate-500">Flood Probability ({forecastHorizon}):</span>
                      <strong className="font-bold text-indigo-700">{Math.round(prob * 100)}%</strong>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* ── IMD Automated Rainfall Stations ─────────────────────────────── */}
        {layers.rainfall &&
          rainfallStations.map((rf) => (
            <Marker
              key={`rain-${rf.district}`}
              position={[rf.latitude, rf.longitude]}
              icon={createRainfallIcon(rf)}
            >
              <Popup>
                <div className="w-52 p-2.5 font-sans">
                  <div className="flex items-center justify-between border-b pb-1 mb-1.5">
                    <strong className="text-xs text-slate-900">{rf.district} Rain Gauge</strong>
                    <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                      IMD
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mb-1.5">{rf.intensity_label} Rain ({rf.category})</p>
                  <div className="bg-blue-50/70 p-2 rounded-lg border border-blue-100 flex items-center justify-between">
                    <span className="text-xs text-slate-600">Daily Actual:</span>
                    <span className="text-xs font-bold text-blue-800 font-mono">{rf.daily_actual_mm} mm</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* ── Historical Flood Landmark Events ────────────────────────────── */}
        {layers.historicalFloods &&
          historicalFloods.map((ev, idx) => (
            <Marker
              key={`hist-${ev.id || idx}`}
              position={[ev.latitude, ev.longitude]}
              icon={createHistoricalFloodIcon()}
            >
              <Popup>
                <div className="w-64 p-3 font-sans">
                  <div className="flex items-center justify-between border-b pb-1 mb-2">
                    <h5 className="font-bold text-xs text-amber-900">{ev.title}</h5>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                      {ev.date}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">{ev.impact_summary}</p>
                  <div className="bg-amber-50 p-2 rounded-lg border border-amber-200 text-[10px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">District:</span>
                      <strong className="text-slate-800">{ev.district}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Recorded Rainfall:</span>
                      <strong className="text-slate-800">{ev.rainfall_recorded_mm ?? 'N/A'} mm</strong>
                    </div>
                    {ev.verified_source && (
                      <div className="pt-1 text-[9px] text-slate-500 truncate" title={ev.verified_source}>
                        Source: {ev.verified_source}
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* ── Habitations (Villages & Settlements) ─────────────────────────── */}
        {habitations.map((habitation) => (
          <Marker
            key={habitation.id}
            position={habitation.coordinates}
            icon={L.divIcon({
              className: 'habitation-marker',
              html: `
                <div class="w-6 h-6 rounded-full ${
                  habitation.riskStatus === 'CRITICAL' ? 'bg-rose-600 ring-rose-500/80' :
                  habitation.riskStatus === 'HIGH' ? 'bg-amber-500 ring-amber-500/70' :
                  habitation.riskStatus === 'MODERATE' ? 'bg-yellow-500 ring-yellow-500/60' :
                  'bg-emerald-500 ring-emerald-500/50'
                } border-2 border-white shadow-lg flex items-center justify-center text-white text-[9px] font-bold">
                  🏘️
                </div>
              `,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })}
          >
            <Popup>
              <VillagePopup habitation={habitation} />
            </Popup>
          </Marker>
        ))}

        {/* ── Candidate Relocation Sites (RS / DDMA) ───────────────────────── */}
        {layers.candidateSites &&
          sites.map((site) => (
            <Marker
              key={site.id}
              position={site.coordinates}
              icon={createRelocationSiteIcon(site.code)}
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
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* ── Unified Map Navigation Controls (Top-Left) ───────────────────── */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-[1000]">
        <MapNavControls
          onZoomIn={() => mapRef.current?.zoomIn()}
          onZoomOut={() => mapRef.current?.zoomOut()}
          onFocusRisk={handleFocusRiskAreas}
          onReset={handleResetMaharashtra}
        />
      </div>

      {/* ── GIS Layer Controller Dropdown (Top-Right) ────────────────────── */}
      {showControls && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[1000]">
          <MapControls />
        </div>
      )}

      {/* ── Basemap Views Pill Bar (Bottom-Left) ───────────────────────────── */}
      {showControls && (
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-[1000]">
          <BaseLayerControl />
        </div>
      )}

      {/* ── Map Legend (Bottom-Right, Collapsible) ────────────────────────── */}
      {showControls && (
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-[1000]">
          <MapLegend />
        </div>
      )}
    </div>
  );
};
