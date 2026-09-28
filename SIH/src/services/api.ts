import type { 
  Habitation, 
  RelocationSite, 
  CarryingCapacity, 
  HazardAlert, 
  LiveTelemetry,
  OptimizerInput,
  OptimizerResult
} from '../types';
import { 
  mockHabitations, 
  mockRelocationSites, 
  mockCarryingCapacities, 
  mockHazardAlerts, 
  mockTelemetry 
} from './mockData';

// Simulated latency helper
const delay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // Habitations API
  getHabitations: async (district?: string, riskStatus?: string): Promise<Habitation[]> => {
    await delay();
    let data = [...mockHabitations];
    if (district && district !== 'ALL') {
      data = data.filter(h => h.district.toLowerCase() === district.toLowerCase());
    }
    if (riskStatus && riskStatus !== 'ALL') {
      data = data.filter(h => h.riskStatus === riskStatus);
    }
    return data;
  },

  getHabitationById: async (id: string): Promise<Habitation | undefined> => {
    await delay();
    return mockHabitations.find(h => h.id === id);
  },

  // Relocation Sites API
  getRelocationSites: async (district?: string): Promise<RelocationSite[]> => {
    await delay();
    if (district && district !== 'ALL') {
      return mockRelocationSites.filter(s => s.district.toLowerCase() === district.toLowerCase());
    }
    return mockRelocationSites;
  },

  getRelocationSiteById: async (id: string): Promise<RelocationSite | undefined> => {
    await delay();
    return mockRelocationSites.find(s => s.id === id);
  },

  // Carrying Capacity API
  getCarryingCapacities: async (): Promise<CarryingCapacity[]> => {
    await delay();
    return mockCarryingCapacities;
  },

  getCarryingCapacityBySiteId: async (siteId: string): Promise<CarryingCapacity | undefined> => {
    await delay();
    return mockCarryingCapacities.find(c => c.siteId === siteId);
  },

  // Alerts & Telemetry
  getHazardAlerts: async (): Promise<HazardAlert[]> => {
    await delay();
    return mockHazardAlerts;
  },

  getLiveTelemetry: async (): Promise<LiveTelemetry[]> => {
    await delay();
    return mockTelemetry;
  },

  // AI Relocation Optimizer Engine Calculation
  runRelocationOptimizer: async (input: OptimizerInput): Promise<OptimizerResult> => {
    await delay(400); // Simulate AI Multi-Criteria Solver computation
    const habitation = mockHabitations.find(h => h.id === input.habitationId) || mockHabitations[0];
    
    // Calculate distance and suitability match score for candidate sites
    const evaluatedSites = mockRelocationSites.map(site => {
      // Euclidean distance estimation in km
      const dLat = (site.coordinates[0] - habitation.coordinates[0]) * 111;
      const dLng = (site.coordinates[1] - habitation.coordinates[1]) * 105;
      const distance = parseFloat(Math.sqrt(dLat * dLat + dLng * dLng).toFixed(1));

      // Match scoring based on distance, infra, suitability
      let score = site.suitability - (distance * 0.8);
      if (input.prioritizeInfrastructure) score += 4;
      if (input.preserveCommunityCohesion) score += 3;
      
      return {
        ...site,
        distanceKm: distance,
        computedMatchScore: Math.min(99, Math.max(50, Math.round(score)))
      };
    })
    .filter(site => site.distanceKm <= input.maxDistanceKm && site.suitability >= input.minSuitabilityPct)
    .sort((a, b) => b.computedMatchScore - a.computedMatchScore);

    const primarySite = evaluatedSites[0] || mockRelocationSites[0];
    const alternativeSites = evaluatedSites.slice(1, 4);

    const capacityStatus = mockCarryingCapacities.find(c => c.siteId === primarySite.id) || mockCarryingCapacities[0];

    const estimatedCost = (habitation.population * 145000).toLocaleString('en-IN');
    const matchScore = primarySite.computedMatchScore || primarySite.suitability;

    return {
      habitation,
      primarySite,
      alternativeSites,
      carryingCapacityStatus: capacityStatus,
      estimatedCostINR: `₹${estimatedCost}`,
      relocationTimeframeWeeks: Math.ceil(habitation.population / 60) + 4,
      recommendationReason: `Optimal match based on multi-hazard immunity (${primarySite.subScores.hazard}% score), high infrastructure stability, and close geographic proximity (${primarySite.distanceKm} km).`,
      matchScore
    };
  }
};
