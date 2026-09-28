import axios from 'axios';
import type { 
  Habitation, 
  RelocationSite, 
  CarryingCapacity, 
  HazardAlert, 
  LiveTelemetry,
  OptimizerInput,
  OptimizerResult,
  CWCGaugeStation,
  IMDRainfallStation,
  HistoricalFloodRecord
} from '../types';
import { 
  mockHabitations, 
  mockRelocationSites, 
  mockCarryingCapacities, 
  mockHazardAlerts, 
  mockTelemetry 
} from './mockData';

const API_BASE = 'http://127.0.0.1:8000';

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiService = {
  getStations: async (): Promise<CWCGaugeStation[]> => {
    try {
      const res = await axios.get(API_BASE + '/stations', { timeout: 3000 });
      if (res.data && res.data.stations && res.data.stations.length > 0) {
        return res.data.stations;
      }
    } catch {
      console.warn('Backend /stations not reachable, using fallback river stations.');
    }
    return [
      { station: 'KURUNDWAD', district: 'Kolhapur', river: 'Krishna / Panchganga', basin: 'Krishna', latitude: 16.684444, longitude: 74.602222, latest_discharge: 8950.0, max_discharge: 12400.0, probability_6h: 0.81, probability_12h: 0.88, probability_24h: 0.95, risk_6h: 'EXTREME', risk_12h: 'EXTREME', risk_24h: 'EXTREME', rainfall_24h_mm: 145.0 },
      { station: 'Chiplun (Muradpur)', district: 'Ratnagiri', river: 'Vashisti', basin: 'West Flowing', latitude: 17.539722, longitude: 73.523889, latest_discharge: 4890.0, max_discharge: 6200.0, probability_6h: 0.81, probability_12h: 0.88, probability_24h: 0.95, risk_6h: 'EXTREME', risk_12h: 'EXTREME', risk_24h: 'EXTREME', rainfall_24h_mm: 182.0 },
      { station: 'Mangaon', district: 'Raigad', river: 'Savitri', basin: 'West Flowing', latitude: 18.231389, longitude: 73.283333, latest_discharge: 3900.0, max_discharge: 4500.0, probability_6h: 0.74, probability_12h: 0.82, probability_24h: 0.89, risk_6h: 'HIGH', risk_12h: 'EXTREME', risk_24h: 'EXTREME', rainfall_24h_mm: 164.0 },
      { station: 'Badlapur', district: 'Thane', river: 'Ulhas', basin: 'West Flowing', latitude: 19.162222, longitude: 73.254167, latest_discharge: 2450.0, max_discharge: 3100.0, probability_6h: 0.65, probability_12h: 0.72, probability_24h: 0.77, risk_6h: 'HIGH', risk_12h: 'HIGH', risk_24h: 'HIGH', rainfall_24h_mm: 110.0 },
      { station: 'Karad', district: 'Satara', river: 'Krishna', basin: 'Krishna', latitude: 17.293611, longitude: 74.190000, latest_discharge: 3420.0, max_discharge: 4800.0, probability_6h: 0.62, probability_12h: 0.68, probability_24h: 0.73, risk_6h: 'HIGH', risk_12h: 'HIGH', risk_24h: 'HIGH', rainfall_24h_mm: 92.0 },
      { station: 'Dhond', district: 'Pune', river: 'Bhima', basin: 'Krishna', latitude: 18.473889, longitude: 74.576389, latest_discharge: 3100.0, max_discharge: 4200.0, probability_6h: 0.58, probability_12h: 0.63, probability_24h: 0.68, risk_6h: 'MEDIUM', risk_12h: 'HIGH', risk_24h: 'HIGH', rainfall_24h_mm: 85.0 },
      { station: 'NANDRE', district: 'Sangli', river: 'Krishna', basin: 'Krishna', latitude: 16.949167, longitude: 74.529722, latest_discharge: 6200.0, max_discharge: 7800.0, probability_6h: 0.78, probability_12h: 0.84, probability_24h: 0.89, risk_6h: 'HIGH', risk_12h: 'EXTREME', risk_24h: 'EXTREME', rainfall_24h_mm: 98.0 },
      { station: 'Bamni (Ballarsha)', district: 'Chandrapur', river: 'Godavari', basin: 'Godavari', latitude: 19.814444, longitude: 79.379167, latest_discharge: 3100.0, max_discharge: 5400.0, probability_6h: 0.55, probability_12h: 0.62, probability_24h: 0.68, risk_6h: 'MEDIUM', risk_12h: 'HIGH', risk_24h: 'HIGH', rainfall_24h_mm: 78.0 },
      { station: 'Aheri (Gudem Bridge)', district: 'Gadchiroli', river: 'Godavari', basin: 'Godavari', latitude: 19.416667, longitude: 79.972222, latest_discharge: 1540.0, max_discharge: 21000.0, probability_6h: 0.52, probability_12h: 0.59, probability_24h: 0.65, risk_6h: 'MEDIUM', risk_12h: 'HIGH', risk_24h: 'HIGH', rainfall_24h_mm: 72.0 },
      { station: 'Nanded', district: 'Nanded', river: 'Godavari', basin: 'Godavari', latitude: 19.150000, longitude: 77.310000, latest_discharge: 1540.0, max_discharge: 2800.0, probability_6h: 0.45, probability_12h: 0.52, probability_24h: 0.58, risk_6h: 'MEDIUM', risk_12h: 'MEDIUM', risk_24h: 'MEDIUM', rainfall_24h_mm: 54.0 },
      { station: 'Kopergaon', district: 'Ahmadnagar', river: 'Godavari', basin: 'Godavari', latitude: 19.890000, longitude: 74.490000, latest_discharge: 620.0, max_discharge: 1400.0, probability_6h: 0.31, probability_12h: 0.37, probability_24h: 0.43, risk_6h: 'MEDIUM', risk_12h: 'MEDIUM', risk_24h: 'MEDIUM', rainfall_24h_mm: 30.0 }
    ];
  },

  getRainfallStations: async (): Promise<IMDRainfallStation[]> => {
    try {
      const res = await axios.get(API_BASE + '/rainfall-stations', { timeout: 3000 });
      if (res.data && res.data.rainfall_stations) {
        return res.data.rainfall_stations;
      }
    } catch {
      console.warn('Backend /rainfall-stations not reachable.');
    }
    return [];
  },

  getHistoricalFloodEvents: async (): Promise<HistoricalFloodRecord[]> => {
    try {
      const res = await axios.get(API_BASE + '/flood-events', { timeout: 3000 });
      if (res.data && res.data.events) {
        return res.data.events;
      }
    } catch {
      console.warn('Backend /flood-events not reachable.');
    }
    return [
      { title: 'July 2005 Mumbai Deluge', district: 'Mumbai City / Suburban', date: '2005-07-26', rainfall_recorded_mm: 944.2, latitude: 19.0760, longitude: 72.8777, impact_summary: 'Catastrophic urban deluge; Mithi river overflow; >1,000 casualties.' },
      { title: 'August 2019 Kolhapur & Sangli Mega-Flood', district: 'Kolhapur', date: '2019-08-08', rainfall_recorded_mm: 450.0, latitude: 16.7050, longitude: 74.2433, impact_summary: 'Panchganga & Krishna rivers exceeded danger mark; 400,000 evacuated.' },
      { title: 'July 2021 Chiplun (Konkan) Inundation', district: 'Ratnagiri', date: '2021-07-22', rainfall_recorded_mm: 600.0, latitude: 17.5323, longitude: 73.5183, impact_summary: 'Vashisti river submerged Chiplun city up to 15-20 ft depth.' },
      { title: 'July 2021 Mahad Floods & Taliye Landslide', district: 'Raigad', date: '2021-07-22', rainfall_recorded_mm: 480.0, latitude: 18.0820, longitude: 73.4220, impact_summary: 'Savitri river breach flooded town; fatal hillside landslide in Taliye.' },
      { title: 'October 2020 Solapur Riverine Inundation', district: 'Solapur', date: '2020-10-15', rainfall_recorded_mm: 185.0, latitude: 17.6599, longitude: 75.9064, impact_summary: 'Sina and Bhima river backwaters submerged agricultural lowlands.' }
    ];
  },

  getRiskMap: async (horizon = '24h') => {
    try {
      const res = await axios.get(API_BASE + '/risk-map?horizon=' + horizon, { timeout: 4000 });
      if (res.data && res.data.features) {
        return res.data;
      }
    } catch {
      console.warn('Backend /risk-map not reachable.');
    }
    return null;
  },

  predictLocation: async (params: { district: string; rainfall_24h?: number; river_discharge?: number }) => {
    try {
      const res = await axios.post(API_BASE + '/predict', params, { timeout: 3000 });
      return res.data;
    } catch {
      return null;
    }
  },

  getHabitations: async (district?: string, riskStatus?: string): Promise<Habitation[]> => {
    await delay();
    let data = [...mockHabitations];
    if (district && district !== 'ALL') {
      data = data.filter((h) => h.district.toLowerCase() === district.toLowerCase());
    }
    if (riskStatus && riskStatus !== 'ALL') {
      data = data.filter((h) => h.riskStatus === riskStatus);
    }
    return data;
  },

  getHabitationById: async (id: string): Promise<Habitation | undefined> => {
    await delay();
    return mockHabitations.find((h) => h.id === id);
  },

  getRelocationSites: async (district?: string): Promise<RelocationSite[]> => {
    await delay();
    if (district && district !== 'ALL') {
      return mockRelocationSites.filter((s) => s.district.toLowerCase() === district.toLowerCase());
    }
    return mockRelocationSites;
  },

  getRelocationSiteById: async (id: string): Promise<RelocationSite | undefined> => {
    await delay();
    return mockRelocationSites.find((s) => s.id === id);
  },

  getCarryingCapacities: async (): Promise<CarryingCapacity[]> => {
    await delay();
    return mockCarryingCapacities;
  },

  getCarryingCapacityBySiteId: async (siteId: string): Promise<CarryingCapacity | undefined> => {
    await delay();
    return mockCarryingCapacities.find((c) => c.siteId === siteId);
  },

  getHazardAlerts: async (): Promise<HazardAlert[]> => {
    try {
      const res = await axios.get(API_BASE + '/alerts?horizon=24h', { timeout: 3000 });
      if (res.data && res.data.alerts && res.data.alerts.length > 0) {
        interface CapAlert {
          identifier?: string;
          info?: {
            severity?: string;
            headline?: string;
            area?: { areaDesc?: string };
            description?: string;
            parameters?: { river_discharge_m3s?: number };
          };
        }
        const liveAlerts: HazardAlert[] = res.data.alerts.map((a: CapAlert, i: number) => {
          const sev = a.info && a.info.severity ? a.info.severity.toUpperCase() : 'HIGH';
          const severityVal: HazardAlert['severity'] = sev === 'EXTREME' ? 'CRITICAL' : (sev === 'HIGH' ? 'HIGH' : 'MODERATE');
          return {
            id: a.identifier || ('alert-' + i),
            severity: severityVal,
            title: (a.info && a.info.headline) || 'High Flood Threat Indication',
            district: (a.info && a.info.area && a.info.area.areaDesc) || 'Maharashtra',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            message: (a.info && a.info.description) || 'Model-based flood runoff surge predicted for river basin.',
            affectedCount: Math.round(((a.info && a.info.parameters && a.info.parameters.river_discharge_m3s) || 2500) * 1.8),
            resolved: false
          };
        });
        return [...liveAlerts, ...mockHazardAlerts];
      }
    } catch {
      // Backend not reached, return mock alerts
    }
    return mockHazardAlerts;
  },

  getLiveTelemetry: async (): Promise<LiveTelemetry[]> => {
    await delay();
    return mockTelemetry;
  },

  runRelocationOptimizer: async (input: OptimizerInput): Promise<OptimizerResult> => {
    await delay(400);
    const habitation = mockHabitations.find((h) => h.id === input.habitationId) || mockHabitations[0];
    
    const evaluatedSites = mockRelocationSites.map((site) => {
      const dLat = (site.coordinates[0] - habitation.coordinates[0]) * 111;
      const dLng = (site.coordinates[1] - habitation.coordinates[1]) * 105;
      const distance = parseFloat(Math.sqrt(dLat * dLat + dLng * dLng).toFixed(1));

      let score = site.suitability - (distance * 0.8);
      if (input.prioritizeInfrastructure) score += 4;
      if (input.preserveCommunityCohesion) score += 3;
      
      return {
        ...site,
        distanceKm: distance,
        computedMatchScore: Math.min(99, Math.max(50, Math.round(score)))
      };
    })
    .filter((site) => site.distanceKm <= input.maxDistanceKm && site.suitability >= input.minSuitabilityPct)
    .sort((a, b) => b.computedMatchScore - a.computedMatchScore);

    const primarySite = evaluatedSites[0] || mockRelocationSites[0];
    const alternativeSites = evaluatedSites.slice(1, 4);
    const capacityStatus = mockCarryingCapacities.find((c) => c.siteId === primarySite.id) || mockCarryingCapacities[0];
    const estimatedCost = (habitation.population * 145000).toLocaleString('en-IN');
    const matchScore = primarySite.computedMatchScore || primarySite.suitability;

    return {
      habitation,
      primarySite,
      alternativeSites,
      carryingCapacityStatus: capacityStatus,
      estimatedCostINR: 'INR ' + estimatedCost,
      relocationTimeframeWeeks: Math.ceil(habitation.population / 60) + 4,
      recommendationReason: 'Optimal match based on multi-hazard immunity (' + primarySite.subScores.hazard + '% score), high infrastructure stability, and close geographic proximity (' + primarySite.distanceKm + ' km).',
      matchScore
    };
  }
};
