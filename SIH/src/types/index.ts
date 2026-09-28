export type RiskStatus = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'SAFE';

export type PriorityLevel = 'P1 - Immediate' | 'P2 - High Priority' | 'P3 - Moderate' | 'P4 - Watch';

export interface DisasterEvent {
  id: string;
  year: number;
  type: 'Flood' | 'Landslide' | 'Cloudburst' | 'Cyclone' | 'Soil Erosion';
  impact: string;
  casualties: number;
  damageEstimate: string;
  description: string;
}

export interface HazardScores {
  flood: number;       // 0 - 100
  landslide: number;   // 0 - 100
  rainfall: number;    // 0 - 100
  vulnerability: number; // 0 - 100
}

export interface Habitation {
  id: string;
  name: string;
  district: string;
  taluka: string;
  coordinates: [number, number]; // [lat, lng]
  population: number;
  households: number;
  hazardScores: HazardScores;
  riskStatus: RiskStatus;
  priorityLevel: PriorityLevel;
  priorityScore: number; // 0 - 100
  recommendedSiteId: string;
  disasterHistory: DisasterEvent[];
  status: 'VULNERABLE' | 'OPTIMIZED' | 'RELOCATING' | 'SETTLED';
  lastAssessed: string;
}

export interface SubScores {
  hazard: number;   // Low hazard exposure (higher is safer)
  water: number;    // Water availability index
  roads: number;    // Road accessibility index
  health: number;   // Healthcare proximity score
  schooling: number;// Education facility score
  terrain: number;  // Slope stability & terrain suitability
}

export interface RelocationSite {
  id: string;
  code: string;
  name: string;
  district: string;
  taluka: string;
  suitability: number; // Percentage score (0 - 100)
  totalCapacity: number; // Person capacity
  assignedCount: number; // Assigned population
  coordinates: [number, number]; // [lat, lng]
  distanceKm: number;
  subScores: SubScores;
  status: 'AVAILABLE' | 'NEAR_CAPACITY' | 'FULL';
  landAreaHectares: number;
  soilType: string;
  nearestHighwayKm: number;
  amenities: string[];
}

export type ResourceType = 'Water' | 'Land' | 'Housing' | 'Healthcare' | 'Schooling';

export interface CarryingCapacity {
  siteId: string;
  siteName: string;
  district: string;
  landLimit: number;      // Persons
  waterLimit: number;     // Persons
  housingLimit: number;   // Persons
  healthcareLimit: number;// Persons
  schoolingLimit: number; // Persons
  landUsage: number;
  waterUsage: number;
  housingUsage: number;
  healthcareUsage: number;
  schoolingUsage: number;
  bottleneckResource: ResourceType;
  maxSafeCapacity: number; // Lowest of limits
}

export interface HazardAlert {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  title: string;
  district: string;
  timestamp: string;
  message: string;
  affectedCount: number;
  resolved?: boolean;
}

export interface User {
  id: string;
  name: string;
  role: 'SDMA_OFFICER' | 'GIS_ANALYST' | 'DISTRICT_MAGISTRATE';
  district: string;
  email: string;
  avatar: string;
}

export interface OptimizerInput {
  habitationId: string;
  maxDistanceKm: number;
  minSuitabilityPct: number;
  prioritizeInfrastructure: boolean;
  preserveCommunityCohesion: boolean;
}

export interface OptimizerResult {
  habitation: Habitation;
  primarySite: RelocationSite;
  alternativeSites: RelocationSite[];
  carryingCapacityStatus: CarryingCapacity;
  estimatedCostINR: string;
  relocationTimeframeWeeks: number;
  recommendationReason: string;
  matchScore: number;
}

export interface GISLayerState {
  multiHazard: boolean;
  flood: boolean;
  landslide: boolean;
  rainfall: boolean;
  candidateSites: boolean;
}

export interface LiveTelemetry {
  stationId: string;
  stationName: string;
  district: string;
  rainfallMmHr: number;
  soilMoisturePct: number;
  displacementMmDay: number;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  lastUpdated: string;
}
