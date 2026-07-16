// Pulse2026 - Stadium Operations & Fan Experience Mock Database
// Explicitly structured for RAG, Zero-Shot, and Time-Series simulations.

export interface RAGChunk {
  id: string;
  category: 'Security' | 'Transit' | 'Crowd' | 'Sustainability' | 'Facilities' | 'Ticketing';
  title: string;
  content: string;
  embedding: number[]; // 2D projection for vector space visualization
  keywords: string[];
}

export interface QueuePrediction {
  gate: string;
  currentWait: number; // in minutes
  currentFlow: number; // people/min
  capacity: number; // max people/min
  trend: 'rising' | 'falling' | 'stable';
  forecast15m: number; // LSTM simulated prediction
  forecast30m: number; // LSTM simulated prediction
  forecast60m: number; // LSTM simulated prediction
  status: 'Normal' | 'Warning' | 'Critical';
}

export interface IncidentSOP {
  category: string;
  severity: 'Low' | 'Medium' | 'High';
  sopSteps: string[];
  contactGroup: string;
  dispatchTemplate: string;
  confidenceScore: number;
}

export interface WasteItem {
  id: string;
  name: string;
  type: string;
  points: number;
  carbonSavedGrams: number;
  recyclability: string;
  sop: string;
  imageUrl: string;
}

export interface RouteNode {
  id: string;
  name: string;
  type: 'gate' | 'concourse' | 'sector' | 'transit' | 'concession';
  crowdLevel: 'low' | 'medium' | 'high';
}

export interface RoutePath {
  id: string;
  from: string;
  to: string;
  distanceMeters: number;
  baseTimeMins: number;
  congestedTimeMins: number;
  isCongested: boolean;
  alternativeRouteId?: string;
  aiRerouteReason?: string;
}

// 1. RAG Knowledge Base - Detailed operational rules of the stadium
export const ragKnowledgeBase: RAGChunk[] = [
  {
    id: 'chunk-1',
    category: 'Security',
    title: 'Bag Policy & Prohibited Items',
    content: 'Only clear bags smaller than 12x6x12 inches are permitted. Backpacks, camera cases, and large purses are strictly prohibited. Exceptions are made for medically necessary items after thorough screening at Gate 3. Drones, flares, laser pointers, and aerosol cans are confiscated immediately. Violations will result in ticket revocation and immediate stadium escort.',
    embedding: [0.15, 0.85],
    keywords: ['bag policy', 'prohibited', 'gate 3', 'clear bags', 'security screening', 'confiscated']
  },
  {
    id: 'chunk-2',
    category: 'Security',
    title: 'Emergency Evacuation & Assembly Points',
    content: 'In the event of a stadium-wide evacuation, sirens will sound and the PA system will guide spectators. All emergency exits on levels 100, 200, and 300 will unlock automatically. Fans must exit via the nearest gate and gather at designated assembly areas: North Parking Lot A, East Plaza, or South Park. Do not use elevators; all escalators will switch to downward-only flow.',
    embedding: [0.12, 0.92],
    keywords: ['emergency evacuation', 'exit gates', 'assembly areas', 'PA system', 'fire safety']
  },
  {
    id: 'chunk-3',
    category: 'Transit',
    title: 'Metro Line Link & Shuttle Operations',
    content: 'The Express Metro Station links directly to Gate 1 (North Concourse). Post-match shuttles run every 3 minutes starting from the 80th minute of the match. Shuttles to Downtown Hub depart from Transit Bay B (South Plaza). Rideshare pick-up zone is designated exclusively at Lot G (1.2 km walking distance, accessible via the green path). ADA shuttle vans are available at Gate 4.',
    embedding: [0.75, 0.25],
    keywords: ['metro link', 'shuttles', 'transit bay b', 'rideshare lot g', 'ADA shuttle', 'gate 1']
  },
  {
    id: 'chunk-4',
    category: 'Crowd',
    title: 'Ingress & Egress Management Protocols',
    content: 'Peak ingress is expected between 90 to 30 minutes before kick-off. Gates 2 and 4 utilize biometric turnstiles to accelerate ticketing checks. During egress, gate flow is managed dynamically. If Exit Gate 3 experiences a bottleneck, egress flows are diverted toward Gate 5 using dynamic overhead digital displays and volunteer-directed megaphone channels.',
    embedding: [0.45, 0.65],
    keywords: ['ingress', 'egress', 'turnstiles', 'gate flow', 'dynamic displays', 'bottleneck']
  },
  {
    id: 'chunk-5',
    category: 'Sustainability',
    title: 'Waste Diversion & Recycling Policies',
    content: 'The FIFA 2026 Green Stadium initiative targets a zero-waste-to-landfill tournament. Green bins are dedicated to organic food waste, blue bins are for recyclable plastic cups and aluminum cans, and grey bins are for general waste. All stadium food vendors are required to use compostable packaging. Fans recycling at Eco-Stations receive 50 Eco-Points per scanned item.',
    embedding: [0.82, 0.78],
    keywords: ['sustainability', 'waste diversion', 'recycling', 'green bins', 'eco-points', 'compostable']
  },
  {
    id: 'chunk-6',
    category: 'Facilities',
    title: 'Lost & Found & Medical Aid Stations',
    content: 'Lost & Found is located at Sector 112 on the main concourse. Medical aid stations are staffed continuously: Level 1 (Sector 104 & 128), Level 2 (Sector 214 & 232), and Level 3 (Sector 302). AED devices are mounted every 100 meters along all main corridors. Emergency medical dispatch is coordinated via Channel 9 of the stadium radio grid.',
    embedding: [0.32, 0.45],
    keywords: ['lost and found', 'medical stations', 'Sector 112', 'AED devices', 'first aid', 'Sector 104']
  },
  {
    id: 'chunk-7',
    category: 'Ticketing',
    title: 'Mobile Ticketing & Troubleshooting',
    content: 'All entry tickets for FIFA World Cup 2026 are digital-only via the official app. NFC-enabled scanners are active at all turnstiles. In case of display failure or device battery drain, fans must proceed to the Ticket Troubleshooting Kiosks situated outside Gates 1, 3, and 5. Ticket agents can verify IDs and print physical thermal passes with unique holographic codes.',
    embedding: [0.28, 0.12],
    keywords: ['digital ticketing', 'NFC scanners', 'troubleshooting kiosks', 'gate 3', 'holographic', 'thermal pass']
  },
  {
    id: 'chunk-8',
    category: 'Facilities',
    title: 'Accessible & ADA Accommodations',
    content: 'Wheelchair seating is available in Row W of sectors 101-105, 118-122, and 205-210. Audio description devices for visually impaired spectators can be checked out at Guest Services (Sector 101). Sensory-friendly quiet rooms are located at Suite Level 2, Room 24A, offering a noise-reduced environment for neurodivergent guests.',
    embedding: [0.88, 0.42],
    keywords: ['ADA accommodations', 'wheelchair seating', 'audio description', 'sensory room', 'guest services']
  },
  {
    id: 'chunk-9',
    category: 'Transit',
    title: 'Real-Time Decision Support & Operational Intelligence',
    content: 'Pulse2026 provides a real-time decision support system (DSS) for the FIFA World Cup 2026, delivering operational intelligence across all sectors. The platform uses Generative AI to coordinate security dispatches, shuttle transit bay B timetables, gate flow congestion rerouting, and fan green rewards scanning. Volunteers coordinate in real time to resolve bottlenecks.',
    embedding: [0.55, 0.55],
    keywords: ['decision support', 'operational intelligence', 'real-time decision', 'triage', 'FIFA World Cup 2026', 'volunteer coordination']
  }
];

// 2. Incident SOP Mapping - Zero-Shot classification targets
export const incidentSOPs: Record<string, IncidentSOP> = {
  'Medical Emergency': {
    category: 'Medical Emergency',
    severity: 'High',
    sopSteps: [
      'Immediately dispatch nearby Level 1 responder with AED.',
      'Alert central medical coordinator at Sector 104 Station.',
      'Clear immediate area to permit medical vehicle access.',
      'Log vitals and timeline of incident in the central stadium database.'
    ],
    contactGroup: 'Medical Response Unit (Red Team)',
    dispatchTemplate: '[ALERT] MEDICAL EMERGENCY reported at [LOCATION]. Team [DISPATCH_TEAM] proceed immediately with trauma kit. Dispatch ID: MD-[ID]. Urgent response required.',
    confidenceScore: 0.96
  },
  'Security Threat / Altercation': {
    category: 'Security Threat / Altercation',
    severity: 'High',
    sopSteps: [
      'Deploy nearest security crew (minimum 3 officers).',
      'Monitor CCTV cameras feeds 12 and 14 for situational tracking.',
      'Establish a containment perimeter around the sector.',
      'If escalated, contact municipal police liaisons stationed at command center.'
    ],
    contactGroup: 'Stadium Security Sector Guard (Black Team)',
    dispatchTemplate: '[ALERT] SECURITY ALTERCATION reported in Sector [LOCATION]. Sector Guard team dispatch immediately. Log security intervention. Dispatch ID: SC-[ID]. Maintain crowd separation.',
    confidenceScore: 0.94
  },
  'Facilities Spill / Slip Hazard': {
    category: 'Facilities Spill / Slip Hazard',
    severity: 'Medium',
    sopSteps: [
      'Locate spill area and place a caution sign immediately.',
      'Dispatch wet-dry vacuum team from environmental services.',
      'Verify standard floor sanitization and surface dry checks.',
      'Log incident clearance with photos.'
    ],
    contactGroup: 'Sanitation & Safety Crew (Yellow Team)',
    dispatchTemplate: '[ALERT] SLIP HAZARD / SPILL reported at [LOCATION]. Environmental crew dispatch with signs and cleaning kit. Dispatch ID: FL-[ID]. Ensure surface dry verification.',
    confidenceScore: 0.92
  },
  'Crowd Congestion / Gate Bottleneck': {
    category: 'Crowd Congestion / Gate Bottleneck',
    severity: 'Medium',
    sopSteps: [
      'Activate overflow turnstiles and update digital overhead signs.',
      'Instruct volunteers to reroute incoming fans to adjacent lighter gates.',
      'Deploy queue marshals to structure line formatting.',
      'Sync status with transit operations to adjust bus shuttle frequencies.'
    ],
    contactGroup: 'Crowd Flow Marshals (Orange Team)',
    dispatchTemplate: '[ALERT] FLOW BOTTLENECK at [LOCATION]. Crowd Marshals deploy for manual queues management. Shift visual route signs. Dispatch ID: CR-[ID].',
    confidenceScore: 0.89
  },
  'Ticketing / Access Issues': {
    category: 'Ticketing / Access Issues',
    severity: 'Low',
    sopSteps: [
      'Direct fans to the closest Troubleshooting Kiosk.',
      'Ensure NFC scanner software reboot if multiple tickets fail.',
      'Provide secondary manual ticket barcode verification.'
    ],
    contactGroup: 'Ticketing Operations (Blue Team)',
    dispatchTemplate: '[INFO] TICKETING ANOMALY at [LOCATION]. Helpdesk representative review NFC scan metrics. Dispatch ID: TK-[ID]. Assistance required.',
    confidenceScore: 0.85
  }
};

// 3. Queue Predictions - Simulated LSTM output data
export const queuePredictions: QueuePrediction[] = [
  {
    gate: 'Gate 1 (North - Metro Link)',
    currentWait: 22,
    currentFlow: 140,
    capacity: 150,
    trend: 'rising',
    forecast15m: 29,
    forecast30m: 35,
    forecast60m: 15,
    status: 'Warning'
  },
  {
    gate: 'Gate 2 (East - Car Park A)',
    currentWait: 8,
    currentFlow: 45,
    capacity: 120,
    trend: 'stable',
    forecast15m: 9,
    forecast30m: 10,
    forecast60m: 8,
    status: 'Normal'
  },
  {
    gate: 'Gate 3 (South - Shuttle Hub)',
    currentWait: 34,
    currentFlow: 175,
    capacity: 160,
    trend: 'rising',
    forecast15m: 42,
    forecast30m: 48,
    forecast60m: 20,
    status: 'Critical'
  },
  {
    gate: 'Gate 4 (West - Main Concourse)',
    currentWait: 12,
    currentFlow: 80,
    capacity: 130,
    trend: 'falling',
    forecast15m: 9,
    forecast30m: 5,
    forecast60m: 4,
    status: 'Normal'
  },
  {
    gate: 'Gate 5 (Express - Corporate / VIP)',
    currentWait: 3,
    currentFlow: 15,
    capacity: 60,
    trend: 'stable',
    forecast15m: 4,
    forecast30m: 3,
    forecast60m: 2,
    status: 'Normal'
  }
];

// 4. Waste Scan Items
export const wasteCatalog: WasteItem[] = [
  {
    id: 'eco-1',
    name: 'PET Water Bottle',
    type: 'Recyclable Plastic',
    points: 50,
    carbonSavedGrams: 84.5,
    recyclability: '98% High Recyclability',
    sop: 'Empty liquid contents. Remove plastic cap and place in BLUE recycling bins. AI scan confirms PET-1 grade plastic. Yields +50 Eco-Points.',
    imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&q=80'
  },
  {
    id: 'eco-2',
    name: 'Aluminum Soda Can',
    type: 'Recyclable Metal',
    points: 60,
    carbonSavedGrams: 120.0,
    recyclability: '100% Fully Recyclable',
    sop: 'Crush can if possible. Throw into BLUE recycling bins. AI scanner confirms raw aluminum content. Yields +60 Eco-Points.',
    imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&q=80'
  },
  {
    id: 'eco-3',
    name: 'Hot Dog Cardboard Tray',
    type: 'Compostable Fiber',
    points: 40,
    carbonSavedGrams: 45.2,
    recyclability: '92% Compostable',
    sop: 'Remove remaining napkins. Toss into GREEN organic compostable bin. Eco-ink and biodegradable paper compost checks pass. Yields +40 Eco-Points.',
    imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&q=80'
  },
  {
    id: 'eco-4',
    name: 'Half-Eaten Pretzel',
    type: 'Organic Waste',
    points: 20,
    carbonSavedGrams: 15.0,
    recyclability: '100% Compostable',
    sop: 'Place pretzel and organic matter in GREEN compost bin. Methane offset algorithm records food waste reduction. Yields +20 Eco-Points.',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80'
  }
];

// 5. Navigation Routes data
export const routeNodes: RouteNode[] = [
  { id: 'n-gate3', name: 'Gate 3 (South Hub)', type: 'gate', crowdLevel: 'high' },
  { id: 'n-gate4', name: 'Gate 4 (West entrance)', type: 'gate', crowdLevel: 'low' },
  { id: 'n-sec104', name: 'Sector 104 Seating', type: 'sector', crowdLevel: 'medium' },
  { id: 'n-sec120', name: 'Sector 120 Seating', type: 'sector', crowdLevel: 'high' },
  { id: 'n-con1', name: 'Main Concourse - West Wing', type: 'concourse', crowdLevel: 'low' },
  { id: 'n-con2', name: 'Main Concourse - South Wing', type: 'concourse', crowdLevel: 'high' },
  { id: 'n-food1', name: 'Vegan Delights Concession', type: 'concession', crowdLevel: 'low' },
  { id: 'n-food2', name: 'FIFA Official Merch Store', type: 'concession', crowdLevel: 'high' }
];

export const routePaths: RoutePath[] = [
  {
    id: 'p-1',
    from: 'Gate 3 (South Hub)',
    to: 'Sector 120 Seating',
    distanceMeters: 450,
    baseTimeMins: 5,
    congestedTimeMins: 14,
    isCongested: true,
    alternativeRouteId: 'p-1-alt',
    aiRerouteReason: 'AI Alert: South Wing Concourse is bottlenecked due to Gate 3 high ingress load. AI recommends routing via West Wing Concourse (50m longer, but saves 6 minutes).'
  },
  {
    id: 'p-1-alt',
    from: 'Gate 3 (South Hub)',
    to: 'Sector 120 Seating (Alt via West)',
    distanceMeters: 520,
    baseTimeMins: 6,
    congestedTimeMins: 7,
    isCongested: false
  },
  {
    id: 'p-2',
    from: 'Gate 4 (West entrance)',
    to: 'Sector 104 Seating',
    distanceMeters: 280,
    baseTimeMins: 3,
    congestedTimeMins: 4,
    isCongested: false
  },
  {
    id: 'p-3',
    from: 'Sector 104 Seating',
    to: 'FIFA Official Merch Store',
    distanceMeters: 180,
    baseTimeMins: 2,
    congestedTimeMins: 8,
    isCongested: true,
    alternativeRouteId: 'p-3-alt',
    aiRerouteReason: 'AI Alert: Merch store queue has expanded into central corridor. Rerouting via Outer VIP Ring.'
  },
  {
    id: 'p-3-alt',
    from: 'Sector 104 Seating',
    to: 'FIFA Official Merch Store (Alt)',
    distanceMeters: 260,
    baseTimeMins: 3,
    congestedTimeMins: 4,
    isCongested: false
  }
];

// Helper to simulate vector similarity search
export function computeCosineSimilarityMock(query: string, chunk: RAGChunk): number {
  // A realistic mockup similarity based on keyword overlap
  const queryLower = query.toLowerCase();
  let matches = 0;
  chunk.keywords.forEach(keyword => {
    if (queryLower.includes(keyword.toLowerCase())) {
      matches += 1;
    }
  });

  const baseScore = 0.45; // baseline random context similarity
  const increment = (matches / Math.max(chunk.keywords.length, 1)) * 0.5;
  return Math.min(parseFloat((baseScore + increment + (query.length % 5) * 0.01).toFixed(4)), 0.98);
}

export interface IncidentRecord {
  id: string;
  description: string;
  category: string;
  severity: 'Low' | 'Medium' | 'High';
  confidence: number;
  dispatcher: string;
  status: 'Dispatched' | 'Resolved';
  timestamp: string;
}
