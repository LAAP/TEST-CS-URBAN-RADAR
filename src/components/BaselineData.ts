// San Francisco Baseline Data and KPI Calculation Utilities

export type DemographicProfile = {
  students: number; // University Students (S)
  entrepreneurs: number; // Young Entrepreneurs (E)
  workers: number; // Workers (W)
  families: number; // Families (F)
  highIncome: number; // High-Income (H)
};

export type BaselineScenario = {
  populationDensity: number; // people/km²
  demographic: DemographicProfile;
  parksPerThousand: number; // acres per 1,000 people
  amenitiesPerTenThousand: number; // per 10,000 people
  areaKm2: number;
};

export const SF_BASELINE: BaselineScenario = {
  populationDensity: 7000,
  demographic: {
    students: 0.15,
    entrepreneurs: 0.10,
    workers: 0.35,
    families: 0.30,
    highIncome: 0.10,
  },
  parksPerThousand: 4.1, // acres per 1,000 people
  amenitiesPerTenThousand: 15, // per 10,000 people
  areaKm2: 121.4, // San Francisco area
};

export type SFBaseline = {
  parks_per_1000: number;
  parkland_pct_city_area: number;
  park_access_pct: number;
  water_pipe_miles_per_capita: number;
  water_investment_per_capita: number;
  sewer_miles_per_capita: number;
  electricity_per_capita_kwh: number;
  transit_stops_per_km2: number;
  transit_grade: string;
  safety_staff_per_1000: number;
  safety_cost_per_capita: number;
  health_facilities_per_1000: number;
  health_spending_per_capita: number;
  population: number;
  area_km2: number;
  amenities: number;
  demographics: DemographicProfile;
};

export async function loadSFBaseline(): Promise<SFBaseline> {
  const data = await import('../sf_baseline.json');
  return data.default as SFBaseline;
}

// Utility functions for calculations (stubs, to be filled in)
export function calculateDiversityIndex(profile: DemographicProfile): number {
  // Shannon entropy, normalized 0-1
  const values = Object.values(profile).filter(v => v > 0);
  const entropy = -values.reduce((sum, p) => sum + p * Math.log(p), 0);
  const maxEntropy = Math.log(5); // 5 groups
  return entropy / maxEntropy;
}

export function calculateAmenities(population: number, amenitiesPerTenThousand: number): number {
  return (population / 10000) * amenitiesPerTenThousand;
}

// Amenity Accessibility Score (AAS) = (Amenities / Area) × (Population / Area)
export function calculateAAS(amenities: number, areaKm2: number, population: number): number {
  if (areaKm2 === 0) return 0;
  return (amenities / areaKm2) * (population / areaKm2);
}

// Economic Vibrancy (EV) = proxy: (Entrepreneurs + High-Income) × Diversity Index
export function calculateEV(profile: DemographicProfile, diversityIndex: number): number {
  return (profile.entrepreneurs + profile.highIncome) * diversityIndex;
}

// Innovation Vibrancy (IV) = proxy: (Students + Entrepreneurs) × Diversity Index
export function calculateIV(profile: DemographicProfile, diversityIndex: number): number {
  return (profile.students + profile.entrepreneurs) * diversityIndex;
}

// Social Vibrancy (SV) = proxy: (Workers + Families) × Diversity Index
export function calculateSV(profile: DemographicProfile, diversityIndex: number): number {
  return (profile.workers + profile.families) * diversityIndex;
}

// Add more calculation utilities as needed 