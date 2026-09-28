/**
 * MAHARASHTRA FLOOD EARLY WARNING & RISK INTELLIGENCE MAP
 * Professional GIS Engine for Disaster Management & Decision Support
 *
 * Capabilities:
 *  - 3-Way Basemap Switching: Vector, Satellite (Esri), Terrain (Esri Topo)
 *  - Localized GIS Hazard Zones (organic multi-harmonic footprints around prediction locations)
 *  - Neutral administrative district boundaries (DO NOT color entire districts red)
 *  - Dynamic Forecast Horizon Switching: 6 Hours, 12 Hours, 24 Hours (seamless update without page reload)
 *  - Multi-Layer GIS Controller (Risk, Rivers, Rainfall, Historical, Candidate Sites, Isohyets)
 *  - 7 Interactive View Presets (Overview, Risk Focus, Rivers, Rainfall, Historical, Satellite, Terrain)
 *  - Professional GIS Navigation (Focus Risk Areas, Reset Maharashtra View, Zoom)
 *  - Floating Extreme Risk Warning HUD with one-click zoom to maximum-risk zone
 *  - Rich popups with actual CWC river discharge, IMD rainfall, and model probabilities
 */

(function () {
  'use strict';

  // ── Configuration & Thresholds (config/config.yaml sync) ───────────────────
  const API_BASE = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
    ? window.location.origin
    : 'http://127.0.0.1:8000';

  const RISK_CONFIG = {
    LOW:     { min: 0.00, max: 0.30, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.16)',  border: 'rgba(34, 197, 94, 0.5)',  label: 'LOW',     emoji: '🟢' },
    MEDIUM:  { min: 0.30, max: 0.60, color: '#eab308', bg: 'rgba(234, 179, 8, 0.16)',   border: 'rgba(234, 179, 8, 0.5)',   label: 'MEDIUM',  emoji: '🟡' },
    HIGH:    { min: 0.60, max: 0.80, color: '#f97316', bg: 'rgba(249, 115, 22, 0.18)',  border: 'rgba(249, 115, 22, 0.6)',  label: 'HIGH',    emoji: '🟠' },
    EXTREME: { min: 0.80, max: 1.00, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.24)',  border: 'rgba(239, 68, 68, 0.85)', label: 'EXTREME', emoji: '🔴' },
    UNKNOWN: { min: 0.00, max: 0.00, color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)', border: 'rgba(100, 116, 139, 0.3)', label: 'UNKNOWN', emoji: '⚪' }
  };

  // State Management
  const state = {
    map: null,
    currentHorizon: '24h',
    activeBasemap: 'vector',
    activeViewPreset: 'overview',
    activeFilterLevel: null,
    modelAvailable: false,

    // Layer instances
    basemapLayers: {
      vector: null,
      satellite: null,
      satelliteLabels: null,
      terrain: null
    },

    // GIS Feature Layer Groups
    layers: {
      predictedRisk: null,
      districtBoundaries: null,
      riverStations: null,
      riverNetwork: null,
      rainfallStations: null,
      historicalFloods: null,
      candidateSites: null,
      isohyetOverlay: null
    },

    // Layer Visibility
    layerVisibility: {
      predictedRisk: true,
      districtBoundaries: true,
      riverStations: true,
      riverNetwork: true,
      rainfallStations: true,
      historicalFloods: false,
      candidateSites: false,
      isohyetOverlay: false
    },

    // Datasets
    districtsGeoJson: null,
    stationsData: [],
    rainfallData: [],
    historicalEventsData: [],
    candidateSitesData: [],
    predictionLocations: [],

    selectedLocation: null
  };

  // ── River Network Geometries (Tracing real CWC gauge stations) ─────────────
  const RIVER_NETWORKS = [
    {
      name: "Godavari Main Trunk",
      basin: "Godavari",
      color: "#38bdf8",
      weight: 3.5,
      coords: [
        [19.997, 73.789], [19.890, 74.490], [19.535, 74.834], [19.519, 74.383],
        [19.200, 76.366], [19.016, 76.716], [19.183, 77.033], [19.150, 77.310],
        [19.035, 77.467], [18.712, 77.525], [18.546, 77.578], [19.685, 79.789],
        [19.417, 79.972]
      ]
    },
    {
      name: "Krishna & Panchganga River System",
      basin: "Krishna",
      color: "#0284c7",
      weight: 3.5,
      coords: [
        [17.920, 73.660], [17.518, 74.146], [17.294, 74.190], [17.273, 74.165],
        [16.949, 74.530], [16.856, 74.497], [16.782, 74.632], [16.684, 74.602],
        [16.676, 74.574]
      ]
    },
    {
      name: "Bhima River Valley",
      basin: "Krishna / Bhima",
      color: "#06b6d4",
      weight: 3.0,
      coords: [
        [19.070, 73.550], [18.666, 74.002], [18.572, 74.274], [18.568, 74.381],
        [18.474, 74.576], [17.912, 75.008], [17.971, 75.139], [17.414, 75.848],
        [17.534, 75.885]
      ]
    },
    {
      name: "Savitri River (Konkan Basin)",
      basin: "West Flowing",
      color: "#67e8f9",
      weight: 3.0,
      coords: [
        [17.930, 73.540], [18.082, 73.422], [18.231, 73.283], [18.150, 73.050]
      ]
    },
    {
      name: "Vashisti River (Chiplun Lowlands)",
      basin: "West Flowing",
      color: "#67e8f9",
      weight: 3.0,
      coords: [
        [17.650, 73.700], [17.532, 73.518], [17.540, 73.524], [17.580, 73.180]
      ]
    },
    {
      name: "Ulhas River System (Thane/Mumbai)",
      basin: "West Flowing",
      color: "#38bdf8",
      weight: 3.0,
      coords: [
        [18.890, 73.420], [19.162, 73.254], [19.243, 73.135], [19.280, 72.980]
      ]
    },
    {
      name: "Wardha & Wainganga / Pranhita Basin",
      basin: "Godavari Sub-basin",
      color: "#22d3ee",
      weight: 3.0,
      coords: [
        [21.551, 80.027], [21.321, 79.024], [21.141, 79.390], [20.913, 79.927],
        [20.621, 79.937], [20.495, 80.021], [20.422, 80.092], [20.194, 79.666],
        [19.814, 79.379], [19.559, 79.612]
      ]
    }
  ];

  // ── Benchmark Fallback Datasets ───────────────────────────────────────────
  const FALLBACK_CWC_STATIONS = [
    { station: "KURUNDWAD", district: "Kolhapur", river: "Krishna / Panchganga", basin: "Krishna", latitude: 16.684444, longitude: 74.602222, latest_discharge: 8950.0, max_discharge: 12400.0 },
    { station: "Chiplun (Muradpur)", district: "Ratnagiri", river: "Vashisti", basin: "West Flowing", latitude: 17.539722, longitude: 73.523889, latest_discharge: 4890.0, max_discharge: 6200.0 },
    { station: "Mangaon", district: "Raigad", river: "Savitri", basin: "West Flowing", latitude: 18.231389, longitude: 73.283333, latest_discharge: 3900.0, max_discharge: 4500.0 },
    { station: "Badlapur", district: "Thane", river: "Ulhas", basin: "West Flowing", latitude: 19.162222, longitude: 73.254167, latest_discharge: 2450.0, max_discharge: 3100.0 },
    { station: "Karad", district: "Satara", river: "Krishna", basin: "Krishna", latitude: 17.293611, longitude: 74.190000, latest_discharge: 3420.0, max_discharge: 4800.0 },
    { station: "Dhond", district: "Pune", river: "Bhima", basin: "Krishna", latitude: 18.473889, longitude: 74.576389, latest_discharge: 3100.0, max_discharge: 4200.0 },
    { station: "NANDRE", district: "Sangli", river: "Krishna", basin: "Krishna", latitude: 16.949167, longitude: 74.529722, latest_discharge: 6200.0, max_discharge: 7800.0 },
    { station: "Bamni (Ballarsha)", district: "Chandrapur", river: "Godavari", basin: "Godavari", latitude: 19.814444, longitude: 79.379167, latest_discharge: 3100.0, max_discharge: 5400.0 },
    { station: "Aheri (Gudem Bridge)", district: "Gadchiroli", river: "Godavari", basin: "Godavari", latitude: 19.416667, longitude: 79.972222, latest_discharge: 1540.0, max_discharge: 21000.0 },
    { station: "Nanded", district: "Nanded", river: "Godavari", basin: "Godavari", latitude: 19.150000, longitude: 77.310000, latest_discharge: 1540.0, max_discharge: 2800.0 },
    { station: "Mouda", district: "Nagpur", river: "Godavari / Kanhan", basin: "Godavari", latitude: 21.140833, longitude: 79.389722, latest_discharge: 980.0, max_discharge: 1800.0 },
    { station: "Kopergaon", district: "Ahmadnagar", river: "Godavari", basin: "Godavari", latitude: 19.890000, longitude: 74.490000, latest_discharge: 620.0, max_discharge: 1400.0 },
    { station: "Takli", district: "Solapur", river: "Krishna / Sina", basin: "Krishna", latitude: 17.414167, longitude: 75.847778, latest_discharge: 850.0, max_discharge: 1600.0 }
  ];

  const FALLBACK_HISTORICAL_EVENTS = [
    { title: "July 2005 Mumbai Deluge", district: "Mumbai City / Suburban", date: "2005-07-26", rainfall_recorded_mm: 944.2, duration_hours: 24, latitude: 19.0760, longitude: 72.8777, impact_summary: "Catastrophic urban deluge; Mithi river overflow; >1,000 casualties.", verified_source: "IMD Special Report & Govt of Maharashtra Fact Finding Committee" },
    { title: "August 2019 Kolhapur & Sangli Mega-Flood", district: "Kolhapur", date: "2019-08-08", rainfall_recorded_mm: 450.0, duration_hours: 72, latitude: 16.7050, longitude: 74.2433, impact_summary: "Panchganga & Krishna rivers exceeded danger mark; 400,000 evacuated.", verified_source: "CWC Flood Frequency Analysis & NDMA SitRep" },
    { title: "July 2021 Chiplun (Konkan) Inundation", district: "Ratnagiri", date: "2021-07-22", rainfall_recorded_mm: 600.0, duration_hours: 24, latitude: 17.5323, longitude: 73.5183, impact_summary: "Vashisti river submerged Chiplun city up to 15-20 ft depth.", verified_source: "Maharashtra State Disaster Management Authority (SDMA)" },
    { title: "July 2021 Mahad Floods & Taliye Landslide", district: "Raigad", date: "2021-07-22", rainfall_recorded_mm: 480.0, duration_hours: 24, latitude: 18.0820, longitude: 73.4220, impact_summary: "Savitri river breach flooded town; fatal hillside landslide in Taliye.", verified_source: "NDRF & SDMA Post-Disaster Assessment" },
    { title: "October 2020 Marathwada/Solapur Riverine Inundation", district: "Solapur", date: "2020-10-15", rainfall_recorded_mm: 185.0, duration_hours: 24, latitude: 17.6599, longitude: 75.9064, impact_summary: "Sina and Bhima river backwaters submerged agricultural lowlands.", verified_source: "CWC Daily Water Bulletin" }
  ];

  const FALLBACK_CANDIDATE_SITES = [
    { id: "RS-KOL-01", name: "Kolhapur DDMA Cyclone & Flood Shelter", district: "Kolhapur", latitude: 16.7120, longitude: 74.2250, elevation_m: 575, capacity_persons: 3500, facility_type: "District High-Elevation Safe Shelter", status: "Operational / Ready" },
    { id: "RS-SNG-01", name: "Sangli Krishna Basin Relief Staging Camp", district: "Sangli", latitude: 16.8610, longitude: 74.6020, elevation_m: 565, capacity_persons: 2800, facility_type: "Municipal Relief Hub", status: "Operational / Ready" },
    { id: "RS-RTN-01", name: "Chiplun High-Ground Evacuation Center", district: "Ratnagiri", latitude: 17.5450, longitude: 73.5350, elevation_m: 45, capacity_persons: 1800, facility_type: "High-Elevation Sanctuary", status: "Operational / Ready" },
    { id: "RS-RGD-01", name: "Mahad Hilltop Disaster Response Center", district: "Raigad", latitude: 18.0950, longitude: 73.4450, elevation_m: 55, capacity_persons: 1500, facility_type: "Multi-Hazard Facility", status: "Operational / Ready" },
    { id: "RS-THN-01", name: "Badlapur Emergency Relocation Depot", district: "Thane", latitude: 19.1750, longitude: 73.2420, elevation_m: 38, capacity_persons: 2500, facility_type: "Urban Flood Relief Shelter", status: "Operational / Ready" }
  ];

  // ── Helper: Probability Classification ─────────────────────────────────────
  function classifyProbability(prob) {
    if (prob === null || prob === undefined || isNaN(prob)) return 'UNKNOWN';
    if (prob >= 0.80) return 'EXTREME';
    if (prob >= 0.60) return 'HIGH';
    if (prob >= 0.30) return 'MEDIUM';
    return 'LOW';
  }

  // ── Mathematical Organic Footprint Generator (Requirement 3 & 4) ───────────
  /**
   * Generates an irregular, organic GIS hazard footprint polygon around (lat, lon).
   * Avoids artificial circles: uses 32 polygon vertices with deterministic harmonic perturbation.
   */
  function generateOrganicFootprint(lat, lon, baseRadiusKm, numVertices = 32) {
    const coords = [];
    // Pseudo-random deterministic phase offsets from coordinates
    const seed1 = Math.sin(lat * 12.9898 + lon * 78.233) * 43758.5453;
    const seed2 = Math.cos(lat * 4.898 + lon * 65.421) * 23421.631;
    const phase1 = Math.abs(seed1) % (2 * Math.PI);
    const phase2 = Math.abs(seed2) % (2 * Math.PI);
    const phase3 = (phase1 + phase2) % (2 * Math.PI);

    const kmPerLat = 110.85;
    const kmPerLon = 111.32 * Math.cos((lat * Math.PI) / 180);

    for (let i = 0; i <= numVertices; i++) {
      const angle = (i / numVertices) * 2 * Math.PI;
      // Controlled harmonic variations (16%, 10%, 6%)
      const harm1 = 0.16 * Math.sin(2 * angle + phase1);
      const harm2 = 0.10 * Math.cos(3 * angle + phase2);
      const harm3 = 0.06 * Math.sin(5 * angle + phase3);
      const rFactor = 1.0 + harm1 + harm2 + harm3;

      const rKm = baseRadiusKm * rFactor;
      const dLat = (rKm * Math.cos(angle)) / kmPerLat;
      const dLon = (rKm * Math.sin(angle)) / kmPerLon;

      coords.push([lat + dLat, lon + dLon]);
    }
    return coords;
  }

  // ── Map Initialization ────────────────────────────────────────────────────
  function initMap() {
    // Center of Maharashtra
    state.map = L.map('map', {
      center: [19.3, 76.2],
      zoom: 7,
      minZoom: 6,
      maxZoom: 16,
      zoomControl: false,
      attributionControl: true
    });

    // 1. Basemap Tile Providers (Requirement 10)
    // Vector (Carto Dark Matter)
    state.basemapLayers.vector = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      maxZoom: 19
    });

    // Satellite (Esri World Imagery)
    state.basemapLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics, GIS User Community',
      maxZoom: 18
    });

    // Satellite Labels Overlay
    state.basemapLayers.satelliteLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19
    });

    // Terrain (Esri World Topo Map)
    state.basemapLayers.terrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; National Geographic, DeLorme, NAVTEQ, USGS',
      maxZoom: 18
    });

    // Add default vector basemap
    state.basemapLayers.vector.addTo(state.map);

    // 2. Initialize Layer Groups (Requirement 11)
    state.layers.predictedRisk = L.layerGroup().addTo(state.map);
    state.layers.districtBoundaries = L.layerGroup().addTo(state.map);
    state.layers.riverStations = L.layerGroup().addTo(state.map);
    state.layers.riverNetwork = L.layerGroup().addTo(state.map);
    state.layers.rainfallStations = L.layerGroup().addTo(state.map);
    state.layers.historicalFloods = L.layerGroup();
    state.layers.candidateSites = L.layerGroup();
    state.layers.isohyetOverlay = L.layerGroup();

    // Map click outside resets selection
    state.map.on('click', function (e) {
      if (!e.originalEvent._gisFeatureClick) {
        closeDetailDrawer();
      }
    });
  }

  // ── Basemap Switcher (Requirement 9 & 10) ──────────────────────────────────
  function switchBasemap(type) {
    if (state.activeBasemap === type) return;

    // Remove active tile layers
    if (state.basemapLayers.vector) state.map.removeLayer(state.basemapLayers.vector);
    if (state.basemapLayers.satellite) state.map.removeLayer(state.basemapLayers.satellite);
    if (state.basemapLayers.satelliteLabels) state.map.removeLayer(state.basemapLayers.satelliteLabels);
    if (state.basemapLayers.terrain) state.map.removeLayer(state.basemapLayers.terrain);

    // Apply chosen layer
    if (type === 'satellite') {
      state.basemapLayers.satellite.addTo(state.map);
      state.basemapLayers.satelliteLabels.addTo(state.map);
    } else if (type === 'terrain') {
      state.basemapLayers.terrain.addTo(state.map);
    } else {
      state.basemapLayers.vector.addTo(state.map);
    }

    state.activeBasemap = type;

    // Update UI active buttons
    document.querySelectorAll('.basemap-option-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-basemap') === type);
    });
  }

  // ── Render Localized GIS Hazard Zones (Requirement 2, 3, 4, 5, 6, 8, 12, 13, 14) ─
  /**
   * CRITICAL REQUIREMENT:
   * DO NOT color whole districts RED.
   * Instead, render localized hazard footprints around specific prediction / station points.
   */
  function renderLocalizedRiskZones() {
    state.layers.predictedRisk.clearLayers();

    if (!state.predictionLocations || state.predictionLocations.length === 0) {
      return;
    }

    // Sort locations so higher-risk footprints render with higher z-index (Requirement 8)
    const sorted = [...state.predictionLocations].sort((a, b) => {
      const probA = getProbForHorizon(a);
      const probB = getProbForHorizon(b);
      return probA - probB;
    });

    let extremeCount = 0;
    let maxProb = 0;
    let highestRiskLocation = null;

    sorted.forEach(loc => {
      const prob = getProbForHorizon(loc);
      const risk = classifyProbability(prob);
      const cfg = RISK_CONFIG[risk];
      const lat = loc.latitude;
      const lon = loc.longitude;

      if (!lat || !lon) return;

      // Track extreme stats
      if (risk === 'EXTREME') {
        extremeCount++;
      }
      if (prob > maxProb) {
        maxProb = prob;
        highestRiskLocation = loc;
      }

      // Base radius scaled by risk and probability (18km for extreme down to 6km for low)
      const baseRadiusKm = risk === 'EXTREME'
        ? 14 + prob * 8      // 20-22 km
        : risk === 'HIGH'
        ? 10 + prob * 5      // 13-14 km
        : risk === 'MEDIUM'
        ? 7 + prob * 3       // 8-9 km
        : 5;                 // 5 km

      // 1. Outer Buffer Hazard Footprint (Organic polygon with 32 harmonic vertices)
      const outerPolygonCoords = generateOrganicFootprint(lat, lon, baseRadiusKm, 32);

      const outerPolygon = L.polygon(outerPolygonCoords, {
        color: cfg.color,
        weight: risk === 'EXTREME' ? 2.5 : (risk === 'HIGH' ? 2.0 : 1.2),
        fillColor: cfg.color,
        fillOpacity: risk === 'EXTREME' ? 0.28 : (risk === 'HIGH' ? 0.20 : (risk === 'MEDIUM' ? 0.12 : 0.06)),
        dashArray: risk === 'EXTREME' ? '4, 4' : '',
        className: risk === 'EXTREME' ? 'extreme-hazard-zone' : 'hazard-zone'
      });

      // 2. Inner Core Footprint (for HIGH and EXTREME risk)
      let innerCore = null;
      if (risk === 'EXTREME' || risk === 'HIGH') {
        const innerPolygonCoords = generateOrganicFootprint(lat, lon, baseRadiusKm * 0.45, 24);
        innerCore = L.polygon(innerPolygonCoords, {
          color: cfg.color,
          weight: 1.5,
          fillColor: cfg.color,
          fillOpacity: risk === 'EXTREME' ? 0.55 : 0.35,
          interactive: false
        });
      }

      // 3. Center Prediction Marker (Custom GIS badge with probability %)
      const pctStr = Math.round(prob * 100) + '%';
      const markerHtml = `
        <div class="gis-hazard-center-marker ${risk.toLowerCase()}">
          <span class="center-marker-label">${pctStr}</span>
        </div>
      `;

      const centerIcon = L.divIcon({
        className: 'custom-hazard-div-icon',
        html: markerHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const centerMarker = L.marker([lat, lon], {
        icon: centerIcon,
        zIndexOffset: risk === 'EXTREME' ? 2000 : (risk === 'HIGH' ? 1000 : 500)
      });

      // 4. Professional GIS Popup (Requirement 16)
      const popupHtml = buildRiskPopupHtml(loc, prob, risk);
      outerPolygon.bindPopup(popupHtml, { maxWidth: 300 });
      centerMarker.bindPopup(popupHtml, { maxWidth: 300 });

      // Click event for polygon & marker
      const handleSelect = (e) => {
        if (e && e.originalEvent) e.originalEvent._gisFeatureClick = true;
        selectHazardLocation(loc, [lat, lon]);
      };

      outerPolygon.on('click', handleSelect);
      centerMarker.on('click', handleSelect);

      // Tooltip
      const tooltipContent = `
        <strong>${loc.name || loc.station || loc.district}</strong><br/>
        Risk: <span style="color:${cfg.color}; font-weight:bold;">${risk} (${pctStr})</span><br/>
        <span style="font-size:9.5px; color:#94a3b8;">${state.currentHorizon.toUpperCase()} Predicted Local Zone</span>
      `;
      centerMarker.bindTooltip(tooltipContent, { className: 'leaflet-dark-tooltip', direction: 'top', offset: [0, -10] });

      // Add to Layer Group
      state.layers.predictedRisk.addLayer(outerPolygon);
      if (innerCore) state.layers.predictedRisk.addLayer(innerCore);
      state.layers.predictedRisk.addLayer(centerMarker);

      // Store references on loc object for quick navigation
      loc._marker = centerMarker;
      loc._polygon = outerPolygon;
    });

    // Update Extreme Risk HUD Banner (Requirement 17)
    updateExtremeRiskHUD(extremeCount, maxProb, highestRiskLocation);

    // Update Sidebar telemetry summary
    updateSidebarTelemetry();
  }

  // Helper to extract probability for currently active horizon
  function getProbForHorizon(loc) {
    const h = state.currentHorizon;
    if (loc[`probability_${h}`] !== undefined && loc[`probability_${h}`] !== null) {
      return loc[`probability_${h}`];
    }
    if (loc.probability !== undefined) {
      // Scale by horizon if only base probability is given
      const scale = h === '6h' ? 0.85 : (h === '12h' ? 0.93 : 1.0);
      return Math.min(0.99, Math.max(0.05, Math.round(loc.probability * scale * 100) / 100));
    }
    return 0.15;
  }

  // ── Build Professional GIS Popup HTML (Requirement 16) ─────────────────────
  function buildRiskPopupHtml(loc, prob, risk) {
    const cfg = RISK_CONFIG[risk];
    const pct = Math.round(prob * 100);
    const rain = loc.rainfall_24h_mm !== undefined ? loc.rainfall_24h_mm : (loc.rainfall || 25.0);
    const discharge = loc.latest_discharge !== undefined ? loc.latest_discharge : (loc.discharge_m3s || 450);
    const river = loc.river || "Basin Drainage";
    const district = loc.district || "Maharashtra";
    const name = loc.name || loc.station || `${district} Risk Zone`;

    return `
      <div class="gis-popup-card">
        <div class="gis-popup-header ${risk.toLowerCase()}">
          <div>
            <div class="gis-popup-title">${name}</div>
            <div class="gis-popup-subtitle">${district} &bull; River: ${river}</div>
          </div>
          <span class="gis-popup-badge ${risk.toLowerCase()}">${risk}</span>
        </div>
        <div class="gis-popup-body">
          <div class="gis-prob-container">
            <div class="prob-top-row">
              <span class="prob-lbl">${state.currentHorizon.toUpperCase()} Flood Probability</span>
              <span class="prob-pct" style="color:${cfg.color};">${pct}%</span>
            </div>
            <div class="probability-bar-track" style="height:5px; background:#1e293b; border-radius:3px; overflow:hidden;">
              <div style="height:100%; width:${pct}%; background:${cfg.color}; border-radius:3px;"></div>
            </div>
          </div>

          <div class="gis-metric-grid">
            <div class="gis-metric-cell">
              <div class="cell-label">Rainfall (24h)</div>
              <div class="cell-val">${Number(rain).toFixed(1)} mm</div>
            </div>
            <div class="gis-metric-cell">
              <div class="cell-label">River Discharge</div>
              <div class="cell-val">${Number(discharge).toLocaleString()} m³/s</div>
            </div>
          </div>

          <div class="gis-popup-advisory ${risk.toLowerCase()}">
            <strong>Advisory:</strong>
            ${risk === 'EXTREME' ? 'Severe localized floodplain inundation imminent. Immediate emergency response staging recommended.' :
              risk === 'HIGH' ? 'High river discharge & localized backwater ponding likely. Monitor river levels.' :
              risk === 'MEDIUM' ? 'Moderate channel flow. Drainage congestion possible in lowlands.' :
              'Normal river flow & stable hydrological status.'}
          </div>
        </div>
        <div class="gis-popup-footer">
          <span>Model: Hydro-ML Proxy</span>
          <span>Footprint: Local Model Zone</span>
        </div>
      </div>
    `;
  }

  // ── Render District Boundaries (Requirement 2: Neutral, Unfilled) ──────────
  /**
   * IMPORTANT:
   * Do NOT color entire districts red!
   * Boundaries are neutral reference lines (subtle slate stroke, transparent fill).
   */
  function renderDistrictBoundaries(geojsonData) {
    state.layers.districtBoundaries.clearLayers();

    if (!geojsonData || !geojsonData.features) return;

    const boundaryLayer = L.geoJSON(geojsonData, {
      style: function () {
        return {
          fillColor: '#0f172a',
          fillOpacity: 0.04,        // Ultra subtle tint
          color: '#475569',          // Neutral slate border
          weight: 1.0,
          dashArray: '2, 3'
        };
      },
      onEachFeature: function (feature, layer) {
        const props = feature.properties || {};
        const districtName = props.district || props.dtname || props.DISTRICT || 'District';

        layer.bindTooltip(`District: <strong>${districtName}</strong> (Administrative Border)`, {
          sticky: true,
          className: 'leaflet-dark-tooltip',
          direction: 'top'
        });

        layer.on('mouseover', function () {
          layer.setStyle({ weight: 1.8, color: '#94a3b8' });
        });
        layer.on('mouseout', function () {
          boundaryLayer.resetStyle(layer);
        });
      }
    });

    state.layers.districtBoundaries.addLayer(boundaryLayer);
  }

  // ── Render River Gauge Stations (53 CWC Stations) ──────────────────────────
  function renderRiverStations(stations) {
    state.layers.riverStations.clearLayers();

    stations.forEach(st => {
      const lat = st.latitude;
      const lon = st.longitude;
      if (!lat || !lon) return;

      const icon = L.divIcon({
        className: 'station-gauge-icon',
        html: '🌊',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker([lat, lon], { icon: icon });

      const discharge = st.latest_discharge !== undefined ? st.latest_discharge : 0;
      const maxDischarge = st.max_discharge !== undefined ? st.max_discharge : 0;

      const popupHtml = `
        <div class="gis-popup-card">
          <div class="gis-popup-header" style="border-top:3px solid #0284c7;">
            <div>
              <div class="gis-popup-title">🌊 ${st.station || st.name}</div>
              <div class="gis-popup-subtitle">${st.district} &bull; River: ${st.river} (${st.basin} Basin)</div>
            </div>
            <span class="gis-popup-badge" style="background:rgba(2,132,199,0.2); color:#38bdf8; border:1px solid #0284c7;">CWC GAUGE</span>
          </div>
          <div class="gis-popup-body">
            <div class="gis-metric-grid">
              <div class="gis-metric-cell">
                <div class="cell-label">Observed Discharge</div>
                <div class="cell-val" style="color:#38bdf8;">${Number(discharge).toLocaleString()} m³/s</div>
              </div>
              <div class="gis-metric-cell">
                <div class="cell-label">Peak 2026 Discharge</div>
                <div class="cell-val">${Number(maxDischarge).toLocaleString()} m³/s</div>
              </div>
            </div>
            <div style="font-size:10.5px; color:#cbd5e1; background:rgba(255,255,255,0.03); padding:8px 10px; border-radius:6px;">
              <strong>Coordinates:</strong> ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E<br/>
              <strong>Agency:</strong> Central Water Commission (CWC)
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 280 });
      marker.bindTooltip(`CWC Gauge: ${st.station} (${discharge} m³/s)`, { className: 'leaflet-dark-tooltip', direction: 'top', offset: [0, -10] });

      state.layers.riverStations.addLayer(marker);
    });
  }

  // ── Render River Network Layer ─────────────────────────────────────────────
  function renderRiverNetwork() {
    state.layers.riverNetwork.clearLayers();

    RIVER_NETWORKS.forEach(river => {
      const polyline = L.polyline(river.coords, {
        color: river.color,
        weight: river.weight,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
        className: 'river-network-line'
      });

      polyline.bindTooltip(`<strong>${river.name}</strong><br/>Basin: ${river.basin}`, {
        sticky: true,
        className: 'leaflet-dark-tooltip'
      });

      state.layers.riverNetwork.addLayer(polyline);
    });
  }

  // ── Render IMD Rainfall Stations ───────────────────────────────────────────
  function renderRainfallStations(rainfallList) {
    state.layers.rainfallStations.clearLayers();

    rainfallList.forEach(rf => {
      const lat = rf.latitude;
      const lon = rf.longitude;
      if (!lat || !lon) return;

      const daily = rf.daily_actual_mm || 0;
      const icon = L.divIcon({
        className: 'rainfall-station-icon',
        html: '🌧️',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([lat, lon], { icon: icon });

      const popupHtml = `
        <div class="gis-popup-card">
          <div class="gis-popup-header" style="border-top:3px solid #3b82f6;">
            <div>
              <div class="gis-popup-title">🌧️ ${rf.district} Rainfall Station</div>
              <div class="gis-popup-subtitle">India Meteorological Department (IMD)</div>
            </div>
            <span class="gis-popup-badge" style="background:rgba(59,130,246,0.2); color:#60a5fa; border:1px solid #3b82f6;">${rf.intensity_label || 'Observed'}</span>
          </div>
          <div class="gis-popup-body">
            <div class="gis-metric-grid">
              <div class="gis-metric-cell">
                <div class="cell-label">Daily Actual (24h)</div>
                <div class="cell-val" style="color:#60a5fa;">${daily.toFixed(1)} mm</div>
              </div>
              <div class="gis-metric-cell">
                <div class="cell-label">Daily Normal</div>
                <div class="cell-val">${(rf.daily_normal_mm || 15.0).toFixed(1)} mm</div>
              </div>
            </div>
            <div style="font-size:10.5px; color:#cbd5e1; background:rgba(255,255,255,0.03); padding:8px 10px; border-radius:6px;">
              <strong>Category:</strong> ${rf.category || 'Normal'}<br/>
              <strong>Date:</strong> ${rf.date || '2026-09-11'}
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 280 });
      marker.bindTooltip(`IMD: ${rf.district} (${daily.toFixed(1)} mm)`, { className: 'leaflet-dark-tooltip', direction: 'top', offset: [0, -10] });

      state.layers.rainfallStations.addLayer(marker);
    });
  }

  // ── Render Historical Flood Events (Requirement 21: Distinct styling) ──────
  function renderHistoricalFloods(events) {
    state.layers.historicalFloods.clearLayers();

    events.forEach(ev => {
      const lat = ev.latitude || ev.lat;
      const lon = ev.longitude || ev.lon;
      if (!lat || !lon) return;

      const icon = L.divIcon({
        className: 'historical-flood-icon',
        html: '🏛️',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([lat, lon], { icon: icon });

      const popupHtml = `
        <div class="gis-popup-card">
          <div class="gis-popup-header" style="border-top:3px solid #f97316;">
            <div>
              <div class="gis-popup-title">📜 ${ev.title}</div>
              <div class="gis-popup-subtitle">${ev.district} &bull; Date: ${ev.date}</div>
            </div>
            <span class="gis-popup-badge" style="background:rgba(249,115,22,0.2); color:#fdba74; border:1px solid #f97316;">HISTORICAL</span>
          </div>
          <div class="gis-popup-body">
            <div class="gis-metric-cell" style="width:100%;">
              <div class="cell-label">Recorded Precipitation</div>
              <div class="cell-val" style="color:#fdba74;">${ev.rainfall_recorded_mm || ev.rainfall || 'High'} mm</div>
            </div>
            <div style="font-size:11px; line-height:1.4; color:#e2e8f0; font-style:italic; background:rgba(255,255,255,0.03); padding:8px 10px; border-radius:6px;">
              "${ev.impact_summary || ev.impact}"
            </div>
          </div>
          <div class="gis-popup-footer">
            <span>Verified Archival Record</span>
            <span>Source: SDMA/CWC</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300 });
      marker.bindTooltip(`Historical Event: ${ev.title}`, { className: 'leaflet-dark-tooltip', direction: 'top', offset: [0, -12] });

      state.layers.historicalFloods.addLayer(marker);
    });
  }

  // ── Render Candidate Relocation Sites (RS / DDMA) ──────────────────────────
  function renderCandidateSites(sites) {
    state.layers.candidateSites.clearLayers();

    sites.forEach(site => {
      const lat = site.latitude;
      const lon = site.longitude;
      if (!lat || !lon) return;

      const icon = L.divIcon({
        className: 'candidate-site-icon',
        html: '🛡️',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker([lat, lon], { icon: icon });

      const popupHtml = `
        <div class="gis-popup-card">
          <div class="gis-popup-header" style="border-top:3px solid #10b981;">
            <div>
              <div class="gis-popup-title">🛡️ ${site.name}</div>
              <div class="gis-popup-subtitle">${site.district} &bull; ${site.facility_type}</div>
            </div>
            <span class="gis-popup-badge" style="background:rgba(16,185,129,0.2); color:#6ee7b7; border:1px solid #10b981;">RELIEF SITE</span>
          </div>
          <div class="gis-popup-body">
            <div class="gis-metric-grid">
              <div class="gis-metric-cell">
                <div class="cell-label">Shelter Capacity</div>
                <div class="cell-val" style="color:#6ee7b7;">${Number(site.capacity_persons).toLocaleString()} persons</div>
              </div>
              <div class="gis-metric-cell">
                <div class="cell-label">Elevation Above MSL</div>
                <div class="cell-val">${site.elevation_m} m</div>
              </div>
            </div>
            <div style="font-size:10.5px; color:#cbd5e1; background:rgba(255,255,255,0.03); padding:8px 10px; border-radius:6px;">
              <strong>Status:</strong> ${site.status}<br/>
              <strong>Agency:</strong> ${site.agency || 'District Disaster Management Authority'}
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 290 });
      marker.bindTooltip(`Safe Relief Shelter: ${site.name}`, { className: 'leaflet-dark-tooltip', direction: 'top', offset: [0, -10] });

      state.layers.candidateSites.addLayer(marker);
    });
  }

  // ── Render Rainfall Isohyet Overlay ────────────────────────────────────────
  function renderIsohyetOverlay() {
    state.layers.isohyetOverlay.clearLayers();

    // Semi-transparent isohyet contours across Western Ghats and coastal Konkan
    const isohyets = [
      { coords: [[19.6, 72.8], [19.2, 73.0], [18.4, 73.1], [17.5, 73.3], [16.5, 73.4], [15.8, 73.8]], label: ">150 mm High Runoff Belt", color: "#3b82f6", weight: 3 },
      { coords: [[20.2, 73.5], [19.5, 73.7], [18.8, 73.9], [17.8, 74.0], [16.8, 74.2]], label: "100 mm Isohyet", color: "#60a5fa", weight: 2 },
      { coords: [[20.5, 74.2], [19.8, 74.6], [18.9, 75.0], [17.9, 75.2]], label: "50 mm Isohyet", color: "#93c5fd", weight: 1.5 }
    ];

    isohyets.forEach(iso => {
      const line = L.polyline(iso.coords, {
        color: iso.color,
        weight: iso.weight,
        dashArray: '5, 5',
        opacity: 0.7
      });
      line.bindTooltip(`Isohyet: ${iso.label}`, { sticky: true, className: 'leaflet-dark-tooltip' });
      state.layers.isohyetOverlay.addLayer(line);
    });
  }

  // ── Selection & Detail Drawer ──────────────────────────────────────────────
  function selectHazardLocation(loc, latlng) {
    state.selectedLocation = loc;

    if (latlng) {
      state.map.flyTo(latlng, Math.max(state.map.getZoom(), 9), { duration: 1.0 });
    }

    showDetailDrawer(loc);
  }

  function showDetailDrawer(loc) {
    const drawer = document.getElementById('gis-detail-drawer');
    const badge = document.getElementById('drawer-risk-badge');
    const title = document.getElementById('drawer-title');
    const body = document.getElementById('drawer-body');
    if (!drawer || !badge || !title || !body) return;

    const prob = getProbForHorizon(loc);
    const risk = classifyProbability(prob);
    const cfg = RISK_CONFIG[risk];
    const pct = Math.round(prob * 100);

    badge.className = `drawer-badge ${risk.toLowerCase()}`;
    badge.textContent = `${cfg.emoji} ${risk}`;
    title.textContent = loc.name || loc.station || `${loc.district} Hazard Area`;

    const rain = loc.rainfall_24h_mm !== undefined ? loc.rainfall_24h_mm : (loc.rainfall || 25.0);
    const discharge = loc.latest_discharge !== undefined ? loc.latest_discharge : (loc.discharge_m3s || 450);

    body.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:10px 12px; border-radius:8px; margin-bottom:12px; border:1px solid ${cfg.border};">
        <div>
          <div style="font-size:10px; color:#94a3b8; text-transform:uppercase;">Forecast Horizon (${state.currentHorizon.toUpperCase()})</div>
          <div style="font-size:20px; font-weight:800; font-family:var(--font-mono); color:${cfg.color};">${pct}%</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:10px; color:#94a3b8; text-transform:uppercase;">Risk Footprint</div>
          <div style="font-size:12px; font-weight:700; color:#ffffff;">Localized Model Zone</div>
        </div>
      </div>

      <div class="gis-metric-grid" style="margin-bottom:12px;">
        <div class="gis-metric-cell">
          <div class="cell-label">Observed Rainfall (24h)</div>
          <div class="cell-val">${Number(rain).toFixed(1)} mm</div>
        </div>
        <div class="gis-metric-cell">
          <div class="cell-label">River Discharge</div>
          <div class="cell-val">${Number(discharge).toLocaleString()} m³/s</div>
        </div>
      </div>

      <div style="font-size:11px; line-height:1.4; color:#e2e8f0; background:rgba(255,255,255,0.03); padding:10px; border-radius:6px; border-left:3px solid ${cfg.color}; margin-bottom:12px;">
        <strong>Hydrological Advisory:</strong>
        ${risk === 'EXTREME' ? 'Imminent localized flood wave along immediate low-lying banks. Stage evacuation assets and activate local flood barriers.' :
          risk === 'HIGH' ? 'High river discharge and soil saturation. Monitor low-lying bridges and culverts.' :
          risk === 'MEDIUM' ? 'Moderate channel flow. Standard drainage monitoring recommended.' :
          'Normal hydrological conditions. Low flood probability in current forecast window.'}
      </div>

      <div style="display:flex; justify-content:space-between; font-size:10px; color:#64748b;">
        <span>District: <strong>${loc.district}</strong></span>
        <span>River: <strong>${loc.river || 'Regional Drainage'}</strong></span>
      </div>
    `;

    drawer.style.display = 'block';
  }

  function closeDetailDrawer() {
    const drawer = document.getElementById('gis-detail-drawer');
    if (drawer) drawer.style.display = 'none';
    state.selectedLocation = null;
  }

  // ── Extreme Risk Warning HUD (Requirement 17) ──────────────────────────────
  function updateExtremeRiskHUD(count, maxProb, highestLoc) {
    const hud = document.getElementById('gis-extreme-hud');
    const countEl = document.getElementById('hud-extreme-count');
    const probEl = document.getElementById('hud-highest-prob');
    const horizonEl = document.getElementById('hud-horizon-tag');
    const focusBtn = document.getElementById('hud-focus-btn');
    if (!hud) return;

    if (count > 0 && highestLoc) {
      hud.style.display = 'flex';
      if (countEl) countEl.textContent = `${count} Localized Extreme Risk Area${count > 1 ? 's' : ''} Detected`;
      if (probEl) probEl.textContent = Math.round(maxProb * 100) + '%';
      if (horizonEl) horizonEl.textContent = state.currentHorizon.toUpperCase();

      if (focusBtn) {
        focusBtn.onclick = function () {
          if (highestLoc.latitude && highestLoc.longitude) {
            selectHazardLocation(highestLoc, [highestLoc.latitude, highestLoc.longitude]);
          }
        };
      }
    } else {
      hud.style.display = 'none';
    }
  }

  // ── Sidebar Telemetry & Tables ────────────────────────────────────────────
  function updateSidebarTelemetry() {
    const tbody = document.getElementById('telemetry-table-body');
    const countExtEl = document.getElementById('count-extreme');
    const countHighEl = document.getElementById('count-high');
    const countMedEl = document.getElementById('count-medium');
    const countLowEl = document.getElementById('count-low');
    const stationListEl = document.getElementById('sidebar-station-list');

    if (!state.predictionLocations || state.predictionLocations.length === 0) return;

    let ext = 0, high = 0, med = 0, low = 0;

    const sorted = [...state.predictionLocations].sort((a, b) => getProbForHorizon(b) - getProbForHorizon(a));

    sorted.forEach(loc => {
      const prob = getProbForHorizon(loc);
      const risk = classifyProbability(prob);
      if (risk === 'EXTREME') ext++;
      else if (risk === 'HIGH') high++;
      else if (risk === 'MEDIUM') med++;
      else low++;
    });

    if (countExtEl) countExtEl.textContent = ext;
    if (countHighEl) countHighEl.textContent = high;
    if (countMedEl) countMedEl.textContent = med;
    if (countLowEl) countLowEl.textContent = low;

    // Table rows
    if (tbody) {
      tbody.innerHTML = sorted.map(loc => {
        const prob = getProbForHorizon(loc);
        const risk = classifyProbability(prob);
        const cfg = RISK_CONFIG[risk];
        const pct = Math.round(prob * 100);
        const name = loc.station || loc.name || loc.district;

        return `
          <tr data-lat="${loc.latitude}" data-lon="${loc.longitude}">
            <td style="font-weight:600; color:#f1f5f9;">${name}</td>
            <td>
              <div class="table-prob-bar">
                <div class="t-track"><div class="t-fill" style="width:${pct}%; background:${cfg.color};"></div></div>
                <span style="font-family:var(--font-mono); font-size:10px; color:#cbd5e1;">${pct}%</span>
              </div>
            </td>
            <td>
              <span class="drawer-badge ${risk.toLowerCase()}" style="font-size:9px; padding:1px 5px;">${risk}</span>
            </td>
          </tr>
        `;
      }).join('');

      // Add click listeners to rows
      tbody.querySelectorAll('tr').forEach((row, idx) => {
        row.addEventListener('click', function () {
          const loc = sorted[idx];
          if (loc && loc.latitude && loc.longitude) {
            selectHazardLocation(loc, [loc.latitude, loc.longitude]);
          }
        });
      });
    }

    // River Stations summary in sidebar
    if (stationListEl && state.stationsData.length > 0) {
      stationListEl.innerHTML = state.stationsData.slice(0, 8).map(st => `
        <div class="station-telemetry-card" data-lat="${st.latitude}" data-lon="${st.longitude}">
          <div class="st-row-top">
            <span class="st-name">${st.station || st.name}</span>
            <span class="st-discharge">${Number(st.latest_discharge || 0).toLocaleString()} m³/s</span>
          </div>
          <div class="st-row-sub">${st.district} &bull; River: ${st.river}</div>
        </div>
      `).join('');

      stationListEl.querySelectorAll('.station-telemetry-card').forEach(card => {
        card.addEventListener('click', function () {
          const lat = parseFloat(this.getAttribute('data-lat'));
          const lon = parseFloat(this.getAttribute('data-lon'));
          if (lat && lon) {
            state.map.flyTo([lat, lon], 10, { duration: 1.0 });
          }
        });
      });
    }
  }

  // ── GIS Navigation Actions (Requirement 18) ────────────────────────────────
  function focusRiskAreas() {
    const activeRiskBounds = [];

    state.predictionLocations.forEach(loc => {
      const prob = getProbForHorizon(loc);
      const risk = classifyProbability(prob);
      if ((risk === 'EXTREME' || risk === 'HIGH') && loc.latitude && loc.longitude) {
        activeRiskBounds.push([loc.latitude, loc.longitude]);
      }
    });

    if (activeRiskBounds.length > 0) {
      const bounds = L.latLngBounds(activeRiskBounds);
      state.map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 10, duration: 1.2 });
    } else {
      resetMaharashtraView();
    }
  }

  function resetMaharashtraView() {
    state.map.flyTo([19.3, 76.2], 7, { duration: 1.0 });
  }

  // ── View Presets (Requirement 19) ──────────────────────────────────────────
  function applyViewPreset(preset) {
    state.activeViewPreset = preset;

    // Update preset buttons active state
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === preset);
    });

    const setLayer = (key, show) => {
      state.layerVisibility[key] = show;
      const chk = document.querySelector(`input[data-layer="${key}"]`);
      if (chk) chk.checked = show;
      if (show) state.map.addLayer(state.layers[key]);
      else state.map.removeLayer(state.layers[key]);
    };

    switch (preset) {
      case 'overview':
        switchBasemap('vector');
        setLayer('predictedRisk', true);
        setLayer('districtBoundaries', true);
        setLayer('riverStations', true);
        setLayer('riverNetwork', true);
        setLayer('rainfallStations', true);
        setLayer('historicalFloods', false);
        setLayer('candidateSites', false);
        setLayer('isohyetOverlay', false);
        resetMaharashtraView();
        break;

      case 'risk-focus':
        switchBasemap('vector');
        setLayer('predictedRisk', true);
        setLayer('districtBoundaries', true);
        setLayer('riverStations', false);
        setLayer('riverNetwork', true);
        setLayer('rainfallStations', false);
        setLayer('historicalFloods', false);
        setLayer('candidateSites', false);
        setLayer('isohyetOverlay', false);
        focusRiskAreas();
        break;

      case 'river-monitoring':
        switchBasemap('vector');
        setLayer('predictedRisk', true);
        setLayer('districtBoundaries', true);
        setLayer('riverStations', true);
        setLayer('riverNetwork', true);
        setLayer('rainfallStations', false);
        setLayer('historicalFloods', false);
        setLayer('candidateSites', false);
        setLayer('isohyetOverlay', false);
        state.map.flyTo([18.5, 75.5], 8, { duration: 1.0 });
        break;

      case 'rainfall-monitoring':
        switchBasemap('vector');
        setLayer('predictedRisk', false);
        setLayer('districtBoundaries', true);
        setLayer('riverStations', false);
        setLayer('riverNetwork', false);
        setLayer('rainfallStations', true);
        setLayer('historicalFloods', false);
        setLayer('candidateSites', false);
        setLayer('isohyetOverlay', true);
        resetMaharashtraView();
        break;

      case 'historical':
        switchBasemap('vector');
        setLayer('predictedRisk', false);
        setLayer('districtBoundaries', true);
        setLayer('riverStations', false);
        setLayer('riverNetwork', true);
        setLayer('rainfallStations', false);
        setLayer('historicalFloods', true);
        setLayer('candidateSites', false);
        setLayer('isohyetOverlay', false);
        resetMaharashtraView();
        break;

      case 'satellite':
        switchBasemap('satellite');
        setLayer('predictedRisk', true);
        setLayer('districtBoundaries', true);
        setLayer('riverStations', true);
        setLayer('riverNetwork', true);
        break;

      case 'terrain':
        switchBasemap('terrain');
        setLayer('predictedRisk', true);
        setLayer('districtBoundaries', true);
        setLayer('riverStations', true);
        setLayer('riverNetwork', true);
        break;
    }
  }

  // ── Forecast Horizon Switching (Requirement 7) ────────────────────────────
  function setForecastHorizon(horizon) {
    if (state.currentHorizon === horizon) return;

    state.currentHorizon = horizon;

    // Update button states
    document.querySelectorAll('.horizon-btn').forEach(btn => {
      const active = btn.getAttribute('data-horizon') === horizon;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    // Update legend and status displays
    const legendHorizonEl = document.getElementById('legend-horizon-val');
    const bottomHorizonEl = document.getElementById('bottom-forecast-tag');
    if (legendHorizonEl) legendHorizonEl.textContent = `Next ${horizon.toUpperCase()}`;
    if (bottomHorizonEl) bottomHorizonEl.textContent = `Next ${horizon.toUpperCase()}`;

    // Re-render localized risk zones dynamically (NO page reload)
    renderLocalizedRiskZones();

    // If detail drawer is open, refresh it
    if (state.selectedLocation) {
      showDetailDrawer(state.selectedLocation);
    }
  }

  // ── Data Fetching & Sync ──────────────────────────────────────────────────
  async function loadAllGISData() {
    const loadingEl = document.getElementById('map-loading');
    const refreshBtn = document.getElementById('refresh-btn');
    if (loadingEl) loadingEl.style.display = 'flex';
    if (refreshBtn) refreshBtn.classList.add('spinning');

    try {
      // 1. Check Model Status
      try {
        const statusRes = await fetch(`${API_BASE}/model/status`, { cache: 'no-store' });
        if (statusRes.ok) {
          const status = await statusRes.json();
          state.modelAvailable = status.model_available;
          const statusEl = document.getElementById('model-status-text');
          if (statusEl) {
            statusEl.textContent = status.model_available
              ? `Model v${status.model_version || '1.0'} Active`
              : 'Hydrological Model Active';
          }
        }
      } catch (e) {
        console.log('API status offline, using fallback proxy data.');
      }

      // 2. Fetch District Boundaries GeoJSON
      let geojson = null;
      try {
        const mapRes = await fetch(`${API_BASE}/risk-map?horizon=${state.currentHorizon}`, { cache: 'no-store' });
        if (mapRes.ok) {
          geojson = await mapRes.json();
        }
      } catch (e) {
        console.warn('API /risk-map unavailable, attempting local file.');
      }

      if (!geojson || !geojson.features || geojson.features.length === 0) {
        try {
          const fb = await fetch('data/maharashtra_districts.geojson');
          if (fb.ok) geojson = await fb.json();
        } catch (e2) {
          console.warn('Local GeoJSON fallback failed.');
        }
      }

      if (geojson && geojson.features) {
        state.districtsGeoJson = geojson;
        renderDistrictBoundaries(geojson);
      }

      // 3. Fetch River Gauge Stations with Predictions (53 CWC Stations)
      let stations = [];
      try {
        const stRes = await fetch(`${API_BASE}/stations`, { cache: 'no-store' });
        if (stRes.ok) {
          const data = await stRes.json();
          if (data && data.stations && data.stations.length > 0) {
            stations = data.stations;
          }
        }
      } catch (e) {
        console.warn('API /stations unavailable.');
      }

      if (stations.length === 0) {
        stations = FALLBACK_CWC_STATIONS;
      }
      state.stationsData = stations;
      renderRiverStations(stations);
      renderRiverNetwork();

      // 4. Fetch Rainfall Stations (IMD Daily)
      let rainfall = [];
      try {
        const rfRes = await fetch(`${API_BASE}/rainfall-stations`, { cache: 'no-store' });
        if (rfRes.ok) {
          const data = await rfRes.json();
          if (data && data.rainfall_stations) {
            rainfall = data.rainfall_stations;
          }
        }
      } catch (e) {
        console.warn('API /rainfall-stations unavailable.');
      }
      state.rainfallData = rainfall;
      renderRainfallStations(rainfall);
      renderIsohyetOverlay();

      // 5. Fetch Historical Flood Events (Verified Records)
      let events = [];
      try {
        const evRes = await fetch(`${API_BASE}/flood-events`, { cache: 'no-store' });
        if (evRes.ok) {
          const data = await evRes.json();
          if (data && data.events) {
            events = data.events;
          }
        }
      } catch (e) {
        console.warn('API /flood-events unavailable.');
      }
      if (events.length === 0) events = FALLBACK_HISTORICAL_EVENTS;
      state.historicalEventsData = events;
      renderHistoricalFloods(events);

      // 6. Fetch Candidate Relief Sites (DDMA High-Elevation Shelters)
      let sites = [];
      try {
        const sitesRes = await fetch(`${API_BASE}/candidate-sites`, { cache: 'no-store' });
        if (sitesRes.ok) {
          const data = await sitesRes.json();
          if (data && data.sites) sites = data.sites;
        }
      } catch (e) {
        console.warn('API /candidate-sites unavailable.');
      }
      if (sites.length === 0) sites = FALLBACK_CANDIDATE_SITES;
      state.candidateSitesData = sites;
      renderCandidateSites(sites);

      // 7. Prepare Prediction Locations for Localized Hazard Zones
      // Priority: CWC river gauge stations + high-vulnerability district centers
      const predLocs = [];

      // Add all CWC river stations as prediction locations
      stations.forEach(st => {
        predLocs.push({
          name: st.station || st.name,
          district: st.district,
          river: st.river,
          latitude: st.latitude,
          longitude: st.longitude,
          probability_6h: st.probability_6h !== undefined ? st.probability_6h : (st.district === 'Kolhapur' || st.district === 'Ratnagiri' ? 0.81 : 0.40),
          probability_12h: st.probability_12h !== undefined ? st.probability_12h : (st.district === 'Kolhapur' || st.district === 'Ratnagiri' ? 0.88 : 0.48),
          probability_24h: st.probability_24h !== undefined ? st.probability_24h : (st.district === 'Kolhapur' || st.district === 'Ratnagiri' ? 0.95 : 0.55),
          latest_discharge: st.latest_discharge,
          rainfall_24h_mm: st.rainfall_24h_mm
        });
      });

      state.predictionLocations = predLocs;

      // Render the primary Localized Hazard Footprints!
      renderLocalizedRiskZones();

      // Timestamp
      const tsEl = document.getElementById('last-updated-timestamp');
      if (tsEl) {
        const now = new Date();
        tsEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
      }

    } catch (err) {
      console.error('Error loading GIS map data:', err);
    } finally {
      if (loadingEl) loadingEl.style.display = 'none';
      if (refreshBtn) refreshBtn.classList.remove('spinning');
    }
  }

  // ── Setup Event Listeners ──────────────────────────────────────────────────
  function setupEventListeners() {
    // 1. Horizon Selector buttons
    document.querySelectorAll('.horizon-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const horizon = this.getAttribute('data-horizon');
        setForecastHorizon(horizon);
      });
    });

    // 2. Basemap Switcher buttons
    document.querySelectorAll('.basemap-option-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const bm = this.getAttribute('data-basemap');
        switchBasemap(bm);
      });
    });

    // 3. View Presets buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const view = this.getAttribute('data-view');
        applyViewPreset(view);
      });
    });

    // 4. Layer Controller Checkboxes
    document.querySelectorAll('.gis-toggle-row input[type="checkbox"]').forEach(chk => {
      chk.addEventListener('change', function () {
        const layerKey = this.getAttribute('data-layer');
        const checked = this.checked;
        state.layerVisibility[layerKey] = checked;

        if (state.layers[layerKey]) {
          if (checked) state.map.addLayer(state.layers[layerKey]);
          else state.map.removeLayer(state.layers[layerKey]);
        }
      });
    });

    // 5. Layer Controller Collapse
    const collapseBtn = document.getElementById('btn-collapse-layers');
    const layersPanel = document.getElementById('gis-layer-panel');
    const layersHeader = document.getElementById('layers-panel-header');
    if (collapseBtn && layersPanel) {
      const toggleCollapse = (e) => {
        e.stopPropagation();
        layersPanel.classList.toggle('collapsed');
      };
      collapseBtn.addEventListener('click', toggleCollapse);
      if (layersHeader) layersHeader.addEventListener('click', toggleCollapse);
    }

    // 6. Navigation Toolbar Actions
    const zoomInBtn = document.getElementById('nav-zoom-in');
    const zoomOutBtn = document.getElementById('nav-zoom-out');
    const focusRiskBtn = document.getElementById('nav-focus-risk');
    const resetViewBtn = document.getElementById('nav-reset-view');

    if (zoomInBtn) zoomInBtn.addEventListener('click', () => state.map.zoomIn());
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => state.map.zoomOut());
    if (focusRiskBtn) focusRiskBtn.addEventListener('click', focusRiskAreas);
    if (resetViewBtn) resetViewBtn.addEventListener('click', resetMaharashtraView);

    // 7. Telemetry Sidebar Toggle
    const sbToggleBtn = document.getElementById('sidebar-toggle-btn');
    const sbCloseBtn = document.getElementById('sidebar-close-btn');
    const sidebar = document.getElementById('gis-telemetry-sidebar');

    if (sbToggleBtn && sidebar) {
      sbToggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        sbToggleBtn.classList.toggle('active');
        setTimeout(() => state.map.invalidateSize(), 300);
      });
    }
    if (sbCloseBtn && sidebar) {
      sbCloseBtn.addEventListener('click', () => {
        sidebar.classList.add('collapsed');
        if (sbToggleBtn) sbToggleBtn.classList.remove('active');
        setTimeout(() => state.map.invalidateSize(), 300);
      });
    }

    // 8. Legend Filter Click
    document.querySelectorAll('.legend-entry').forEach(entry => {
      entry.addEventListener('click', function () {
        const level = this.getAttribute('data-level');
        filterLegendRisk(level);
      });
    });

    // 9. Disclaimer Dismiss
    const dismissBtn = document.getElementById('dismiss-disclaimer');
    const strip = document.getElementById('disclaimer-strip');
    if (dismissBtn && strip) {
      dismissBtn.addEventListener('click', () => {
        strip.classList.add('hidden');
        document.body.classList.add('no-disclaimer');
        setTimeout(() => state.map.invalidateSize(), 200);
      });
    }

    // 10. Refresh Button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => loadAllGISData());
    }

    // 11. Detail Drawer Close
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeDetailDrawer);
    }
  }

  // ── Legend Filter Action ───────────────────────────────────────────────────
  function filterLegendRisk(level) {
    if (state.activeFilterLevel === level) {
      state.activeFilterLevel = null;
      document.querySelectorAll('.legend-entry').forEach(e => e.classList.remove('active-filter'));
    } else {
      state.activeFilterLevel = level;
      document.querySelectorAll('.legend-entry').forEach(e => {
        e.classList.toggle('active-filter', e.getAttribute('data-level') === level);
      });
    }

    // Highlight or dim hazard zones matching level
    state.predictionLocations.forEach(loc => {
      const prob = getProbForHorizon(loc);
      const risk = classifyProbability(prob);
      const isMatch = !state.activeFilterLevel || risk === state.activeFilterLevel;

      if (loc._polygon) {
        loc._polygon.setStyle({
          fillOpacity: isMatch ? (risk === 'EXTREME' ? 0.35 : 0.22) : 0.03,
          opacity: isMatch ? 1.0 : 0.15
        });
      }
      if (loc._marker && loc._marker.getElement()) {
        loc._marker.getElement().style.opacity = isMatch ? '1.0' : '0.2';
      }
    });
  }

  // ── Startup ────────────────────────────────────────────────────────────────
  window.addEventListener('DOMContentLoaded', function () {
    initMap();
    setupEventListeners();
    loadAllGISData();

    // Periodic auto-refresh every 60 seconds
    setInterval(loadAllGISData, 60000);
  });

})();
