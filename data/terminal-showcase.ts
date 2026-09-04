export type TerminalModeId = "dgp" | "mea" | "iad" | "tpc";

export interface TerminalMode {
  id: TerminalModeId;
  code: string;
  name: string;
  label: string;
  cadence: string;
  summary: string;
}

export const TERMINAL_MODES: TerminalMode[] = [
  {
    id: "dgp",
    code: "DGP-40",
    name: "Daily Ground Pulse",
    label: "Ground Pulse (DGP)",
    cadence: "Daily @ 18:00 EAT",
    summary: "Ward-level intelligence reports tracking local economic anxieties, competitor movements, and daily supporter growth.",
  },
  {
    id: "mea",
    code: "MEA-08",
    name: "Market Day Audit",
    label: "Market Audit (MEA)",
    cadence: "Weekly by Market Day",
    summary: "Crowd density metrics, physical Kikamba leaflet uptake, and grassroots sentiment captured at major Kitui trading centres.",
  },
  {
    id: "iad",
    code: "IAD-SEC",
    name: "Incident Alert Dispatch",
    label: "Incident Dispatch (IAD)",
    cadence: "Instantaneous (<15 min)",
    summary: "Real-time rapid-response triage for hostile propaganda, billboard interference, and voter confusion incidents.",
  },
  {
    id: "tpc",
    code: "TPC-200K",
    name: "Turnout & Pacing Check",
    label: "Turnout Pacing (TPC)",
    cadence: "Hourly on Polling Day",
    summary: "Real-time vote velocity pacing across all 40 wards against the 198,004 threshold required for victory.",
  },
];

export interface WardPulseData {
  ward: string;
  constituency: string;
  coordinator: string;
  channel: "2G-SMS" | "USSD-Tree" | "WhatsApp-Bot";
  signalStrength: number;
  battery: string;
  dominantIssue: string;
  competitorSignal: string;
  optInSupportersToday: number;
  totalWardSupporters: number;
  targetThreshold: number;
  moodIndex: "Strongly Favourable" | "Consolidating" | "Contested" | "High Opportunity";
  recentAudioDispatch: {
    title: string;
    duration: string;
    speaker: string;
    location: string;
  };
  marketData?: {
    marketName: string;
    crowdEstimate: string;
    leafletsDistributed: number;
    bodaBodaChampionsActive: number;
    keyQuote: string;
  };
  incidentAlert?: {
    tier: "Tier 1 — Flash Critical" | "Tier 2 — High Priority" | "Tier 3 — Routine Watch";
    incidentType: string;
    adversary: string;
    status: "Verified & Debunk Sent" | "Counter-Ad Geofenced" | "Under War Room Review";
    timestamp: string;
  };
  turnoutPacing?: {
    registeredVoters: number;
    targetTurnoutPct: number;
    currentPacingPct: number;
    projectedVotes: number;
    pollingStationsReporting: string;
  };
}

export const WARD_DATA: Record<string, WardPulseData> = {
  "kitui-township": {
    ward: "Township",
    constituency: "Kitui Central",
    coordinator: "M. Musyoka (Coord #01)",
    channel: "WhatsApp-Bot",
    signalStrength: 4,
    battery: "96%",
    dominantIssue: "Water trucking tariffs & municipal stall fees along Kalundu market strip",
    competitorSignal: "Rival camp distribution of unbranded flyers targeting civil servant vote",
    optInSupportersToday: 184,
    totalWardSupporters: 8420,
    targetThreshold: 11200,
    moodIndex: "Strongly Favourable",
    recentAudioDispatch: {
      title: "Kalundu Traders Breakfast Briefing",
      duration: "01:42",
      speaker: "Boda Stage Champion K. Mutisya",
      location: "Kalundu Bus Park",
    },
    marketData: {
      marketName: "Kalundu Open-Air Market",
      crowdEstimate: "4,200 traders & commuters",
      leafletsDistributed: 2450,
      bodaBodaChampionsActive: 48,
      keyQuote: "Traders demand predictable county licensing rather than arbitrary daily impoundment.",
    },
    incidentAlert: {
      tier: "Tier 2 — High Priority",
      incidentType: "False claim regarding Kitui municipal tax enforcement in rival WhatsApp groups",
      adversary: "Rival Independent network",
      status: "Verified & Debunk Sent",
      timestamp: "14:18 EAT",
    },
    turnoutPacing: {
      registeredVoters: 19538,
      targetTurnoutPct: 78,
      currentPacingPct: 81.2,
      projectedVotes: 12660,
      pollingStationsReporting: "32 / 32",
    },
  },
  "kyuso": {
    ward: "Kyuso",
    constituency: "Mwingi North",
    coordinator: "P. Kaleli (Coord #14)",
    channel: "USSD-Tree",
    signalStrength: 2,
    battery: "88%",
    dominantIssue: "Solar borehole pump failure at Kamuwongo; livestock watering queues",
    competitorSignal: "Incumbent proxy promising borehole repairs before market day",
    optInSupportersToday: 126,
    totalWardSupporters: 6140,
    targetThreshold: 7900,
    moodIndex: "High Opportunity",
    recentAudioDispatch: {
      title: "Kyuso Livestock Auction Voice Note",
      duration: "02:15",
      speaker: "Pastoralist Elder M. Ngui",
      location: "Kyuso Auction Yards",
    },
    marketData: {
      marketName: "Nguni Livestock Market (Cross-Ward)",
      crowdEstimate: "6,800 pastoralists & regional buyers",
      leafletsDistributed: 3100,
      bodaBodaChampionsActive: 36,
      keyQuote: "Pastoralists want the county veterinary revolving fund operationalized immediately.",
    },
    incidentAlert: {
      tier: "Tier 1 — Flash Critical",
      incidentType: "Doctored audio circulating on SMS claiming endorsement withdrawal",
      adversary: "Malicious anonymous bulk SMS sender",
      status: "Counter-Ad Geofenced",
      timestamp: "11:05 EAT",
    },
    turnoutPacing: {
      registeredVoters: 19921,
      targetTurnoutPct: 72,
      currentPacingPct: 74.8,
      projectedVotes: 10725,
      pollingStationsReporting: "22 / 22",
    },
  },
  "mutha": {
    ward: "Mutha",
    constituency: "Kitui South",
    coordinator: "D. Mwanzia (Coord #37)",
    channel: "2G-SMS",
    signalStrength: 1,
    battery: "91%",
    dominantIssue: "Boundary water security and sand harvesting concessions without royalty share",
    competitorSignal: "Low physical presence; rival relying on second-hand radio mentions",
    optInSupportersToday: 98,
    totalWardSupporters: 4950,
    targetThreshold: 6400,
    moodIndex: "Consolidating",
    recentAudioDispatch: {
      title: "Mutha Wellhead Elders Delegation",
      duration: "01:55",
      speaker: "Ward Captain F. Ndambuki",
      location: "Mutha Centre",
    },
    marketData: {
      marketName: "Mutomo Friday Market (Hub)",
      crowdEstimate: "3,900 farmers & herders",
      leafletsDistributed: 1850,
      bodaBodaChampionsActive: 28,
      keyQuote: "Communities want community conservancy management contracts audited in public.",
    },
    incidentAlert: {
      tier: "Tier 3 — Routine Watch",
      incidentType: "Rival branded t-shirts handed out at sand collection depot",
      adversary: "UDA ward mobilization team",
      status: "Under War Room Review",
      timestamp: "16:40 EAT",
    },
    turnoutPacing: {
      registeredVoters: 11039,
      targetTurnoutPct: 70,
      currentPacingPct: 71.4,
      projectedVotes: 5510,
      pollingStationsReporting: "18 / 18",
    },
  },
  "miambani": {
    ward: "Miambani",
    constituency: "Kitui Central",
    coordinator: "E. Kilonzo (Coord #09)",
    channel: "WhatsApp-Bot",
    signalStrength: 3,
    battery: "84%",
    dominantIssue: "Feeder road erosion cutoffs disconnecting vegetable farmers from Kitui Town",
    competitorSignal: "Ward-level WhatsApp groups debating the candidate's CDF audit record",
    optInSupportersToday: 142,
    totalWardSupporters: 5880,
    targetThreshold: 7200,
    moodIndex: "Strongly Favourable",
    recentAudioDispatch: {
      title: "Kavisuni Market Women Cooperative",
      duration: "01:18",
      speaker: "Youth Mobilizer S. Mbatha",
      location: "Kavisuni Stage",
    },
    marketData: {
      marketName: "Kavisuni Tuesday Market",
      crowdEstimate: "2,600 smallholder growers",
      leafletsDistributed: 1400,
      bodaBodaChampionsActive: 24,
      keyQuote: "Dr. Makali's CDF track record on school masonry has created immense trust here.",
    },
    incidentAlert: {
      tier: "Tier 2 — High Priority",
      incidentType: "Misrepresented allocation figures for Kavisuni Health Centre",
      adversary: "County Government communication staffer account",
      status: "Verified & Debunk Sent",
      timestamp: "09:30 EAT",
    },
    turnoutPacing: {
      registeredVoters: 11759,
      targetTurnoutPct: 75,
      currentPacingPct: 77.1,
      projectedVotes: 6350,
      pollingStationsReporting: "20 / 20",
    },
  },
  "migwani": {
    ward: "Migwani",
    constituency: "Mwingi West",
    coordinator: "C. Munyoki (Coord #22)",
    channel: "USSD-Tree",
    signalStrength: 3,
    battery: "92%",
    dominantIssue: "Delay in county medical supply replenishment at Migwani Sub-County Hospital",
    competitorSignal: "Wiper local ward delegates rallying uncommitted teachers",
    optInSupportersToday: 165,
    totalWardSupporters: 7310,
    targetThreshold: 9100,
    moodIndex: "Contested",
    recentAudioDispatch: {
      title: "Migwani Teachers & Clerks Forum",
      duration: "02:04",
      speaker: "Coordinator C. Munyoki",
      location: "Migwani Town Hall",
    },
    marketData: {
      marketName: "Migwani Wednesday Open Market",
      crowdEstimate: "5,100 market-goers",
      leafletsDistributed: 2900,
      bodaBodaChampionsActive: 42,
      keyQuote: "Voters compare Dr. Makali's parliamentary oversight to the county health deficit.",
    },
    incidentAlert: {
      tier: "Tier 1 — Flash Critical",
      incidentType: "Rival sound truck broadcasting unverified claim regarding bursary formulas",
      adversary: "Independent faction sound caravan",
      status: "Verified & Debunk Sent",
      timestamp: "13:45 EAT",
    },
    turnoutPacing: {
      registeredVoters: 14678,
      targetTurnoutPct: 76,
      currentPacingPct: 79.5,
      projectedVotes: 8860,
      pollingStationsReporting: "26 / 26",
    },
  },
};

export const WARDS_LIST = [
  { id: "kitui-township", label: "Kitui Township", region: "Central" },
  { id: "kyuso", label: "Kyuso", region: "North" },
  { id: "mutha", label: "Mutha", region: "South" },
  { id: "miambani", label: "Miambani", region: "Rural" },
  { id: "migwani", label: "Migwani", region: "West" },
] as const;
