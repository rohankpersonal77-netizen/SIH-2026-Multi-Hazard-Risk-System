import type { Habitation, RelocationSite, CarryingCapacity, HazardAlert, LiveTelemetry, User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-01',
    name: 'Dr. Rajesh Sharma',
    role: 'SDMA_OFFICER',
    district: 'Maharashtra State SDMA',
    email: 'r.sharma@sdma.maharashtra.gov.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'user-02',
    name: 'Priya Kulkarni',
    role: 'GIS_ANALYST',
    district: 'Pune Command Center',
    email: 'priya.gis@sdma.maharashtra.gov.in',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'
  },
  {
    id: 'user-03',
    name: 'Shri Vikram Deshmukh, IAS',
    role: 'DISTRICT_MAGISTRATE',
    district: 'Pune District',
    email: 'dm.pune@maharashtra.gov.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'
  }
];

export const mockHabitations: Habitation[] = [
  {
    id: 'hab-001',
    name: 'Malin Village (High Slopes)',
    district: 'Pune',
    taluka: 'Ambegaon',
    coordinates: [19.1578, 73.6872],
    population: 480,
    households: 94,
    hazardScores: {
      flood: 65,
      landslide: 94,
      rainfall: 92,
      vulnerability: 89
    },
    riskStatus: 'CRITICAL',
    priorityLevel: 'P1 - Immediate',
    priorityScore: 95.4,
    recommendedSiteId: 'site-017',
    status: 'VULNERABLE',
    lastAssessed: '2026-08-20',
    disasterHistory: [
      {
        id: 'dh-101',
        year: 2014,
        type: 'Landslide',
        impact: 'Massive slope collapse impacting 44 houses',
        casualties: 151,
        damageEstimate: '₹14.2 Cr',
        description: 'Catastrophic landslide triggered by 108mm continuous rainfall over 24 hours.'
      },
      {
        id: 'dh-102',
        year: 2021,
        type: 'Cloudburst',
        impact: 'Debris flow damaged secondary retaining walls',
        casualties: 0,
        damageEstimate: '₹1.8 Cr',
        description: 'Localized cloudburst event resulting in high-velocity soil displacement.'
      },
      {
        id: 'dh-103',
        year: 2025,
        type: 'Landslide',
        impact: 'Cracks detected in upper terrace ridge',
        casualties: 0,
        damageEstimate: '₹45 Lakhs',
        description: 'Geotechnical sensors flagged active shear deformation of 14mm/day.'
      }
    ]
  },
  {
    id: 'hab-002',
    name: 'Khed Shivapur (River Bank)',
    district: 'Pune',
    taluka: 'Khed',
    coordinates: [18.3512, 73.8450],
    population: 1250,
    households: 260,
    hazardScores: {
      flood: 91,
      landslide: 34,
      rainfall: 85,
      vulnerability: 82
    },
    riskStatus: 'CRITICAL',
    priorityLevel: 'P1 - Immediate',
    priorityScore: 88.2,
    recommendedSiteId: 'site-012',
    status: 'VULNERABLE',
    lastAssessed: '2026-08-22',
    disasterHistory: [
      {
        id: 'dh-201',
        year: 2019,
        type: 'Flood',
        impact: 'Submerged 180 homes up to 8ft water level',
        casualties: 4,
        damageEstimate: '₹8.5 Cr',
        description: 'Mutha river basin overflow due to excessive discharge from Khadakwasla dam.'
      },
      {
        id: 'dh-202',
        year: 2023,
        type: 'Flood',
        impact: 'Flash flood breached low embankment wall',
        casualties: 1,
        damageEstimate: '₹3.2 Cr',
        description: 'Short-duration high-intensity downpour (95mm/3hr) causing stream inundation.'
      }
    ]
  },
  {
    id: 'hab-003',
    name: 'Taliye Basti',
    district: 'Raigad',
    taluka: 'Mahad',
    coordinates: [17.9234, 73.4156],
    population: 320,
    households: 65,
    hazardScores: {
      flood: 78,
      landslide: 96,
      rainfall: 95,
      vulnerability: 92
    },
    riskStatus: 'CRITICAL',
    priorityLevel: 'P1 - Immediate',
    priorityScore: 96.8,
    recommendedSiteId: 'site-005',
    status: 'RELOCATING',
    lastAssessed: '2026-08-21',
    disasterHistory: [
      {
        id: 'dh-301',
        year: 2021,
        type: 'Landslide',
        impact: 'Entire hillock slid onto lower habitation zone',
        casualties: 87,
        damageEstimate: '₹18.0 Cr',
        description: 'Extreme multi-day rainfall event weakened basaltic soil layers.'
      }
    ]
  },
  {
    id: 'hab-004',
    name: 'Lavasa Ridge Hamlet',
    district: 'Pune',
    taluka: 'Mulshi',
    coordinates: [18.4123, 73.5123],
    population: 610,
    households: 118,
    hazardScores: {
      flood: 45,
      landslide: 84,
      rainfall: 88,
      vulnerability: 76
    },
    riskStatus: 'HIGH',
    priorityLevel: 'P2 - High Priority',
    priorityScore: 78.5,
    recommendedSiteId: 'site-031',
    status: 'VULNERABLE',
    lastAssessed: '2026-08-19',
    disasterHistory: [
      {
        id: 'dh-401',
        year: 2020,
        type: 'Landslide',
        impact: 'Road blockages and structural slope subsidence',
        casualties: 0,
        damageEstimate: '₹2.1 Cr',
        description: 'Unstable cut slopes along access corridor collapsed after monsoon rains.'
      }
    ]
  },
  {
    id: 'hab-005',
    name: 'Velhe Foothills',
    district: 'Pune',
    taluka: 'Velhe',
    coordinates: [18.2890, 73.6340],
    population: 840,
    households: 175,
    hazardScores: {
      flood: 72,
      landslide: 79,
      rainfall: 89,
      vulnerability: 78
    },
    riskStatus: 'HIGH',
    priorityLevel: 'P2 - High Priority',
    priorityScore: 80.1,
    recommendedSiteId: 'site-017',
    status: 'VULNERABLE',
    lastAssessed: '2026-08-18',
    disasterHistory: [
      {
        id: 'dh-501',
        year: 2022,
        type: 'Soil Erosion',
        impact: 'Agricultural topsoil washing out and mudflow into settlement',
        casualties: 0,
        damageEstimate: '₹1.1 Cr',
        description: 'Heavy runoff eroded natural drainage channels.'
      }
    ]
  },
  {
    id: 'hab-006',
    name: 'Khandala Ghat Valley Settlement',
    district: 'Pune',
    taluka: 'Maval',
    coordinates: [18.7562, 73.3721],
    population: 920,
    households: 190,
    hazardScores: {
      flood: 60,
      landslide: 88,
      rainfall: 94,
      vulnerability: 81
    },
    riskStatus: 'HIGH',
    priorityLevel: 'P2 - High Priority',
    priorityScore: 82.4,
    recommendedSiteId: 'site-009',
    status: 'OPTIMIZED',
    lastAssessed: '2026-08-15',
    disasterHistory: [
      {
        id: 'dh-601',
        year: 2024,
        type: 'Landslide',
        impact: 'Boulders disrupted expressway and adjacent dwellings',
        casualties: 2,
        damageEstimate: '₹4.5 Cr',
        description: 'Rockfall event on steep cut-face during peak rainfall window.'
      }
    ]
  },
  {
    id: 'hab-007',
    name: 'Chiplun River Basin Colony',
    district: 'Ratnagiri',
    taluka: 'Chiplun',
    coordinates: [17.5320, 73.5180],
    population: 1850,
    households: 390,
    hazardScores: {
      flood: 98,
      landslide: 40,
      rainfall: 96,
      vulnerability: 94
    },
    riskStatus: 'CRITICAL',
    priorityLevel: 'P1 - Immediate',
    priorityScore: 94.1,
    recommendedSiteId: 'site-022',
    status: 'VULNERABLE',
    lastAssessed: '2026-08-23',
    disasterHistory: [
      {
        id: 'dh-701',
        year: 2021,
        type: 'Flood',
        impact: 'Unprecedented Vashishti river inundation up to 12ft level',
        casualties: 18,
        damageEstimate: '₹42 Cr',
        description: 'High tide combined with dam discharge flooded commercial and residential market.'
      }
    ]
  },
  {
    id: 'hab-008',
    name: 'Igatpuri Slope Hamlet',
    district: 'Nashik',
    taluka: 'Igatpuri',
    coordinates: [19.6980, 73.5510],
    population: 530,
    households: 105,
    hazardScores: {
      flood: 35,
      landslide: 68,
      rainfall: 82,
      vulnerability: 58
    },
    riskStatus: 'MODERATE',
    priorityLevel: 'P3 - Moderate',
    priorityScore: 61.2,
    recommendedSiteId: 'site-024',
    status: 'VULNERABLE',
    lastAssessed: '2026-08-12',
    disasterHistory: []
  },
  {
    id: 'hab-009',
    name: 'Bhor Plateau Settlement',
    district: 'Pune',
    taluka: 'Bhor',
    coordinates: [18.1520, 73.8410],
    population: 710,
    households: 145,
    hazardScores: {
      flood: 40,
      landslide: 55,
      rainfall: 70,
      vulnerability: 48
    },
    riskStatus: 'MODERATE',
    priorityLevel: 'P3 - Moderate',
    priorityScore: 53.0,
    recommendedSiteId: 'site-012',
    status: 'VULNERABLE',
    lastAssessed: '2026-08-10',
    disasterHistory: []
  },
  {
    id: 'hab-010',
    name: 'Junnar Safe Zone Habitation',
    district: 'Pune',
    taluka: 'Junnar',
    coordinates: [19.2080, 73.8740],
    population: 1400,
    households: 290,
    hazardScores: {
      flood: 20,
      landslide: 15,
      rainfall: 45,
      vulnerability: 25
    },
    riskStatus: 'SAFE',
    priorityLevel: 'P4 - Watch',
    priorityScore: 26.5,
    recommendedSiteId: 'site-024',
    status: 'SETTLED',
    lastAssessed: '2026-08-01',
    disasterHistory: []
  }
];

export const mockRelocationSites: RelocationSite[] = [
  {
    id: 'site-017',
    code: 'RS-017',
    name: 'Malin-West Plateau Resettlement Hub',
    district: 'Pune',
    taluka: 'Ambegaon',
    suitability: 91,
    totalCapacity: 2400,
    assignedCount: 480,
    coordinates: [19.1412, 73.7250],
    distanceKm: 4.8,
    landAreaHectares: 42.5,
    soilType: 'Stable Weathered Basalt (Grade A)',
    nearestHighwayKm: 3.2,
    status: 'AVAILABLE',
    amenities: ['Primary Health Center', 'Zilla Parishad School', 'Solar Microgrid', 'Piped Water Network', 'Community Hall'],
    subScores: {
      hazard: 95,
      water: 88,
      roads: 90,
      health: 86,
      schooling: 92,
      terrain: 94
    }
  },
  {
    id: 'site-024',
    code: 'RS-024',
    name: 'Ambegaon Valley Heights Smart Hub',
    district: 'Pune',
    taluka: 'Ambegaon',
    suitability: 86,
    totalCapacity: 3500,
    assignedCount: 1200,
    coordinates: [19.1120, 73.7840],
    distanceKm: 11.4,
    landAreaHectares: 68.0,
    soilType: 'Compact Laterite Soil',
    nearestHighwayKm: 1.5,
    status: 'AVAILABLE',
    amenities: ['24x7 Water Supply', 'Sub-District Hospital', 'High School', 'Bus Station', 'Police Outpost'],
    subScores: {
      hazard: 89,
      water: 92,
      roads: 94,
      health: 84,
      schooling: 88,
      terrain: 85
    }
  },
  {
    id: 'site-005',
    code: 'RS-005',
    name: 'Mahad Safe Plateau Zone',
    district: 'Raigad',
    taluka: 'Mahad',
    suitability: 89,
    totalCapacity: 1800,
    assignedCount: 1650,
    coordinates: [17.9560, 73.4680],
    distanceKm: 7.2,
    landAreaHectares: 28.4,
    soilType: 'Hard Rock Basalt',
    nearestHighwayKm: 2.1,
    status: 'NEAR_CAPACITY',
    amenities: ['Community Health Center', 'Water Filtration Plant', 'Skill Development Center'],
    subScores: {
      hazard: 92,
      water: 84,
      roads: 88,
      health: 90,
      schooling: 85,
      terrain: 92
    }
  },
  {
    id: 'site-012',
    code: 'RS-012',
    name: 'Khed Greenfield Resettlement Township',
    district: 'Pune',
    taluka: 'Khed',
    suitability: 94,
    totalCapacity: 5000,
    assignedCount: 1800,
    coordinates: [18.4100, 73.8920],
    distanceKm: 8.6,
    landAreaHectares: 95.0,
    soilType: 'Alluvial Flat Terrain',
    nearestHighwayKm: 0.8,
    status: 'AVAILABLE',
    amenities: ['Multi-Specialty Clinic', 'Secondary School', 'Underground Sewage', 'Commercial Market'],
    subScores: {
      hazard: 96,
      water: 95,
      roads: 96,
      health: 92,
      schooling: 94,
      terrain: 96
    }
  },
  {
    id: 'site-031',
    code: 'RS-031',
    name: 'Mulshi Eco Resettlement Colony',
    district: 'Pune',
    taluka: 'Mulshi',
    suitability: 83,
    totalCapacity: 1500,
    assignedCount: 610,
    coordinates: [18.4520, 73.5890],
    distanceKm: 9.3,
    landAreaHectares: 32.0,
    soilType: 'Decomposed Granite & Rock',
    nearestHighwayKm: 4.5,
    status: 'AVAILABLE',
    amenities: ['Solar Power Facility', 'Rainwater Harvesting', 'Primary School'],
    subScores: {
      hazard: 85,
      water: 80,
      roads: 78,
      health: 82,
      schooling: 84,
      terrain: 88
    }
  },
  {
    id: 'site-009',
    code: 'RS-009',
    name: 'Khandala Smart Resettlement Sector 4',
    district: 'Pune',
    taluka: 'Maval',
    suitability: 88,
    totalCapacity: 2800,
    assignedCount: 920,
    coordinates: [18.7890, 73.4120],
    distanceKm: 6.1,
    landAreaHectares: 48.0,
    soilType: 'Layered Basaltic Formation',
    nearestHighwayKm: 1.2,
    status: 'AVAILABLE',
    amenities: ['Emergency Response Station', 'Secondary School', 'Water Treatment Facility'],
    subScores: {
      hazard: 90,
      water: 87,
      roads: 92,
      health: 85,
      schooling: 89,
      terrain: 87
    }
  },
  {
    id: 'site-022',
    code: 'RS-022',
    name: 'Chiplun Hillside Safe Resettlement Park',
    district: 'Ratnagiri',
    taluka: 'Chiplun',
    suitability: 87,
    totalCapacity: 3000,
    assignedCount: 1850,
    coordinates: [17.5680, 73.5620],
    distanceKm: 6.8,
    landAreaHectares: 54.0,
    soilType: 'Elevated Laterite Ridge',
    nearestHighwayKm: 2.8,
    status: 'AVAILABLE',
    amenities: ['Disaster Evacuation Shelter', 'Primary Health Clinic', 'High School'],
    subScores: {
      hazard: 91,
      water: 89,
      roads: 85,
      health: 88,
      schooling: 86,
      terrain: 90
    }
  }
];

export const mockCarryingCapacities: CarryingCapacity[] = [
  {
    siteId: 'site-017',
    siteName: 'RS-017 Malin-West Plateau',
    district: 'Pune',
    landLimit: 4000,
    waterLimit: 2400,
    housingLimit: 3200,
    healthcareLimit: 2800,
    schoolingLimit: 3000,
    landUsage: 480,
    waterUsage: 480,
    housingUsage: 480,
    healthcareUsage: 480,
    schoolingUsage: 480,
    bottleneckResource: 'Water',
    maxSafeCapacity: 2400
  },
  {
    siteId: 'site-024',
    siteName: 'RS-024 Ambegaon Valley Heights',
    district: 'Pune',
    landLimit: 5500,
    waterLimit: 4800,
    housingLimit: 3500,
    healthcareLimit: 4200,
    schoolingLimit: 4000,
    landUsage: 1200,
    waterUsage: 1200,
    housingUsage: 1200,
    healthcareUsage: 1200,
    schoolingUsage: 1200,
    bottleneckResource: 'Housing',
    maxSafeCapacity: 3500
  },
  {
    siteId: 'site-005',
    siteName: 'RS-005 Mahad Safe Plateau',
    district: 'Raigad',
    landLimit: 2200,
    waterLimit: 2000,
    housingLimit: 1800,
    healthcareLimit: 1800,
    schoolingLimit: 2100,
    landUsage: 1650,
    waterUsage: 1650,
    housingUsage: 1650,
    healthcareUsage: 1650,
    schoolingUsage: 1650,
    bottleneckResource: 'Healthcare',
    maxSafeCapacity: 1800
  },
  {
    siteId: 'site-012',
    siteName: 'RS-012 Khed Greenfield Hub',
    district: 'Pune',
    landLimit: 8000,
    waterLimit: 6000,
    housingLimit: 5000,
    healthcareLimit: 5500,
    schoolingLimit: 5200,
    landUsage: 1800,
    waterUsage: 1800,
    housingUsage: 1800,
    healthcareUsage: 1800,
    schoolingUsage: 1800,
    bottleneckResource: 'Housing',
    maxSafeCapacity: 5000
  },
  {
    siteId: 'site-031',
    siteName: 'RS-031 Mulshi Eco Resettlement',
    district: 'Pune',
    landLimit: 2500,
    waterLimit: 1800,
    housingLimit: 1500,
    healthcareLimit: 2000,
    schoolingLimit: 1400,
    landUsage: 610,
    waterUsage: 610,
    housingUsage: 610,
    healthcareUsage: 610,
    schoolingUsage: 610,
    bottleneckResource: 'Schooling',
    maxSafeCapacity: 1400
  }
];

export const mockHazardAlerts: HazardAlert[] = [
  {
    id: 'alt-001',
    severity: 'CRITICAL',
    title: 'RED ALERT: Extreme Slope Displacement Detected',
    district: 'Pune (Ambegaon)',
    timestamp: '10 mins ago',
    message: 'Geotechnical sensor ST-MAL-02 recorded 18mm/hr slope shear movement in Malin Sector B. Immediate evacuation advised.',
    affectedCount: 480
  },
  {
    id: 'alt-002',
    severity: 'CRITICAL',
    title: 'FLASH FLOOD WARNING: Vashishti River Level Crossing Danger Mark',
    district: 'Ratnagiri (Chiplun)',
    timestamp: '25 mins ago',
    message: 'Koyna overflow discharge plus high tide has elevated river level to 7.2 meters. Emergency teams alerted.',
    affectedCount: 1850
  },
  {
    id: 'alt-003',
    severity: 'HIGH',
    title: 'HEAVY RAINFALL WARNING: Extremely Heavy Monsoonal Downpour',
    district: 'Raigad (Mahad)',
    timestamp: '45 mins ago',
    message: 'Automatic weather station recorded 112mm rainfall in 3 hours. Landslide watch initiated for Taliye region.',
    affectedCount: 320
  },
  {
    id: 'alt-004',
    severity: 'MODERATE',
    title: 'Saturating Runoff Watch',
    district: 'Pune (Mulshi)',
    timestamp: '2 hours ago',
    message: 'Soil moisture saturation reached 88%. Drainage clearance crews deployed along ghat roads.',
    affectedCount: 610
  }
];

export const mockTelemetry: LiveTelemetry[] = [
  {
    stationId: 'TEL-MAL-01',
    stationName: 'Ambegaon Ridge Station',
    district: 'Pune',
    rainfallMmHr: 48.5,
    soilMoisturePct: 92.4,
    displacementMmDay: 14.2,
    status: 'CRITICAL',
    lastUpdated: 'Just now'
  },
  {
    stationId: 'TEL-KHD-02',
    stationName: 'Khed Riverbed Sensor Network',
    district: 'Pune',
    rainfallMmHr: 36.0,
    soilMoisturePct: 84.1,
    displacementMmDay: 3.1,
    status: 'WARNING',
    lastUpdated: '1 min ago'
  },
  {
    stationId: 'TEL-MHD-03',
    stationName: 'Taliye Hill Slope Monitor',
    district: 'Raigad',
    rainfallMmHr: 52.0,
    soilMoisturePct: 96.0,
    displacementMmDay: 18.5,
    status: 'CRITICAL',
    lastUpdated: 'Just now'
  },
  {
    stationId: 'TEL-CHP-04',
    stationName: 'Vashishti Basin Water Gauge',
    district: 'Ratnagiri',
    rainfallMmHr: 61.2,
    soilMoisturePct: 89.8,
    displacementMmDay: 1.5,
    status: 'CRITICAL',
    lastUpdated: '2 mins ago'
  },
  {
    stationId: 'TEL-IGN-05',
    stationName: 'Igatpuri Pass Weather Station',
    district: 'Nashik',
    rainfallMmHr: 18.2,
    soilMoisturePct: 65.4,
    displacementMmDay: 0.4,
    status: 'NORMAL',
    lastUpdated: '5 mins ago'
  }
];
