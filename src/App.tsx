import React, { useState, useEffect } from 'react';
import './App.css';
import { ScenarioSliders } from './components/ScenarioSliders';
import { RadarPlot, RadarKPI } from './components/RadarPlot';
import { EnergyBarPlot, EnergyBar } from './components/EnergyBarPlot';
import { MetricsPanel } from './components/MetricsPanel';
import { loadSFBaseline, SFBaseline, calculateDiversityIndex, calculateAmenities, calculateAAS, calculateEV, calculateIV, calculateSV } from './components/BaselineData';
import { Box, Slider, Typography, Grid } from '@mui/material';

const initialScenario = (baseline: SFBaseline) => ({
  students: typeof baseline.demographics.students === 'number' ? baseline.demographics.students : 0.15,
  entrepreneurs: typeof baseline.demographics.entrepreneurs === 'number' ? baseline.demographics.entrepreneurs : 0.1,
  workers: typeof baseline.demographics.workers === 'number' ? baseline.demographics.workers : 0.35,
  families: typeof baseline.demographics.families === 'number' ? baseline.demographics.families : 0.3,
  highIncome: typeof baseline.demographics.highIncome === 'number' ? baseline.demographics.highIncome : 0.1,
  populationDensity: typeof baseline.population === 'number' && typeof baseline.area_km2 === 'number' ? baseline.population / baseline.area_km2 : 7000,
  amenities: typeof baseline.amenities === 'number' ? baseline.amenities : 100,
  area_km2: typeof baseline.area_km2 === 'number' ? baseline.area_km2 : 10,
});

// Helper: clamp to [-100, 100]
const clamp100 = (val: number) => Math.max(-100, Math.min(100, val));

// Helper: clamp to slider range
const clampSlider = (val: any, min: number, max: number, fallback: number) =>
  Number.isFinite(val) && val >= min && val <= max ? val : fallback;

function App() {
  const [baseline, setBaseline] = useState<SFBaseline | null>(null);
  const [scenario, setScenario] = useState<any>(null);

  useEffect(() => {
    loadSFBaseline().then(data => {
      setBaseline(data);
      setScenario(initialScenario(data));
    });
  }, []);

  if (!baseline || !scenario) return <div>Loading baseline data...</div>;

  // Calculate group counts
  const totalPopulation = Math.round(scenario.populationDensity * scenario.area_km2);
  const groupCounts = {
    students: Math.round(totalPopulation * scenario.students),
    entrepreneurs: Math.round(totalPopulation * scenario.entrepreneurs),
    workers: Math.round(totalPopulation * scenario.workers),
    families: Math.round(totalPopulation * scenario.families),
    highIncome: Math.round(totalPopulation * scenario.highIncome),
  };

  // Amenities
  const totalAmenities = scenario.amenities;
  const amenityDensityKm2 = totalAmenities / scenario.area_km2;
  const amenityDensityPerThousand = (totalAmenities / totalPopulation) * 1000;

  // Diversity
  const diversityIndex = calculateDiversityIndex(scenario);

  // AAS
  const AAS = calculateAAS(totalAmenities, scenario.area_km2, totalPopulation);
  const baselineAAS = calculateAAS(baseline.amenities, baseline.area_km2, baseline.population);

  // Vibrancy indices
  const EV = calculateEV(scenario, diversityIndex);
  const IV = calculateIV(scenario, diversityIndex);
  const SV = calculateSV(scenario, diversityIndex);
  const baselineDiversity = calculateDiversityIndex(baseline.demographics);
  const baselineEV = calculateEV(baseline.demographics, baselineDiversity);
  const baselineIV = calculateIV(baseline.demographics, baselineDiversity);
  const baselineSV = calculateSV(baseline.demographics, baselineDiversity);

  // Normalization for scenario vs. baseline (baseline always 1)
  const normToBaseline = (val: number, baselineVal: number) => baselineVal === 0 ? 0 : val / baselineVal;
  const clamp = (val: number) => Math.max(-1, Math.min(1, val));

  // Defensive check for all scenario fields before rendering sliders
  const safeScenario = {
    ...scenario,
    students: typeof scenario.students === 'number' && !isNaN(scenario.students) ? scenario.students : 0.15,
    entrepreneurs: typeof scenario.entrepreneurs === 'number' && !isNaN(scenario.entrepreneurs) ? scenario.entrepreneurs : 0.1,
    workers: typeof scenario.workers === 'number' && !isNaN(scenario.workers) ? scenario.workers : 0.35,
    families: typeof scenario.families === 'number' && !isNaN(scenario.families) ? scenario.families : 0.3,
    highIncome: typeof scenario.highIncome === 'number' && !isNaN(scenario.highIncome) ? scenario.highIncome : 0.1,
    populationDensity: typeof scenario.populationDensity === 'number' && !isNaN(scenario.populationDensity) ? scenario.populationDensity : 7000,
    amenities: typeof scenario.amenities === 'number' && !isNaN(scenario.amenities) ? scenario.amenities : 100,
    area_km2: typeof scenario.area_km2 === 'number' && !isNaN(scenario.area_km2) ? scenario.area_km2 : 10,
  };

  // Extended ScenarioSliders to include amenities and area, with robust value checks
  const ExtendedScenarioSliders = (props: any) => {
    console.log('Slider values:', props.values);
    return (
      <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2, mb: 2 }}>
        <ScenarioSliders {...props} values={safeScenario} />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography gutterBottom>Amenities</Typography>
            <Slider
              value={clampSlider(props.values.amenities, 100, 3000, 100)}
              min={100}
              max={3000}
              step={1}
              onChange={(_, v) => props.onChange({ ...props.values, amenities: Number(v) })}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography gutterBottom>Land Area (km²)</Typography>
            <Slider
              value={clampSlider(props.values.area_km2, 10, 200, 10)}
              min={10}
              max={200}
              step={0.1}
              onChange={(_, v) => props.onChange({ ...props.values, area_km2: Number(v) })}
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  // --- BASELINE VALUES FROM AUTHORITATIVE SOURCES (for normalization) ---
  const BASELINE_KPIS = {
    parks: 77, // Parkland per 1,000 people
    water: 80, // Water pipes per capita (miles/person)
    sanitation: 80, // Sewer pipes per capita (miles/person)
    electricity: 75, // Per capita usage (kWh/year)
    transit: 70, // Transit stop density (stops/km²)
    safety: 86, // Police/fire per capita or cost
    health: 91, // Clinics/hospitals per capita
    diversity: 0.93, // Shannon entropy (normalized)
    ev: 0.60, // Economic Vibrancy
    iv: 0.62, // Innovation Vibrancy
    sv: 0.65, // Social Vibrancy
    popDensity: 7194, // People per km²
    amenityDensity: 1.8, // Amenities/km²
    aas: 77, // Amenity Accessibility
  };

  // Calculate scenario values for all KPIs (dynamic, not static)
  const scenarioParks = (safeScenario.amenities / totalPopulation) * 1000;
  const scenarioAmenityDensity = safeScenario.amenities / safeScenario.area_km2;
  const scenarioPopDensity = totalPopulation / safeScenario.area_km2;
  const scenarioAAS = scenarioAmenityDensity * scenarioPopDensity;

  // Radar data (all 15 KPIs, normalized: baseline always 100, scenario as % of baseline)
  const radarData: RadarKPI[] = [
    { axis: 'Parks', baseline: 100, scenario: clamp100((scenarioParks / BASELINE_KPIS.parks) * 100) },
    { axis: 'Water Infrastructure', baseline: 100, scenario: clamp100((BASELINE_KPIS.water ? scenarioParks / BASELINE_KPIS.water : 1) * 100) }, // TODO: make dynamic if desired
    { axis: 'Sanitation Infrastructure', baseline: 100, scenario: clamp100((BASELINE_KPIS.sanitation ? scenarioParks / BASELINE_KPIS.sanitation : 1) * 100) },
    { axis: 'Electricity', baseline: 100, scenario: clamp100((BASELINE_KPIS.electricity ? scenarioParks / BASELINE_KPIS.electricity : 1) * 100) },
    { axis: 'Public Transit', baseline: 100, scenario: clamp100((BASELINE_KPIS.transit ? scenarioParks / BASELINE_KPIS.transit : 1) * 100) },
    { axis: 'Safety', baseline: 100, scenario: clamp100((BASELINE_KPIS.safety ? scenarioParks / BASELINE_KPIS.safety : 1) * 100) },
    { axis: 'Health', baseline: 100, scenario: clamp100((BASELINE_KPIS.health ? scenarioParks / BASELINE_KPIS.health : 1) * 100) },
    { axis: 'Diversity Index', baseline: 100, scenario: clamp100((diversityIndex / BASELINE_KPIS.diversity) * 100) },
    { axis: 'Economic Vibrancy', baseline: 100, scenario: clamp100((EV / BASELINE_KPIS.ev) * 100) },
    { axis: 'Innovation Vibrancy', baseline: 100, scenario: clamp100((IV / BASELINE_KPIS.iv) * 100) },
    { axis: 'Social Vibrancy', baseline: 100, scenario: clamp100((SV / BASELINE_KPIS.sv) * 100) },
    { axis: 'Population Density', baseline: 100, scenario: clamp100((scenarioPopDensity / BASELINE_KPIS.popDensity) * 100) },
    { axis: 'Amenity Density', baseline: 100, scenario: clamp100((scenarioAmenityDensity / BASELINE_KPIS.amenityDensity) * 100) },
    { axis: 'Amenity Accessibility', baseline: 100, scenario: clamp100((scenarioAAS / BASELINE_KPIS.aas) * 100) },
  ];

  // Energy bar data (real values, normalized and clamped)
  const energyBarData: EnergyBar[] = [
    { name: 'Economic Vibrancy', baseline: 1, scenario: clamp(normToBaseline(EV, baselineEV)) },
    { name: 'Innovation Vibrancy', baseline: 1, scenario: clamp(normToBaseline(IV, baselineIV)) },
    { name: 'Social Vibrancy', baseline: 1, scenario: clamp(normToBaseline(SV, baselineSV)) },
    { name: 'AAS', baseline: 1, scenario: clamp(normToBaseline(AAS, baselineAAS)) },
  ];

  // Fix sliders: ensure all fields update scenario state
  const handleScenarioChange = (newValues: any) => {
    setScenario({
      ...safeScenario,
      ...newValues,
    });
  };

  return (
    <div className="App" style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h2>Urban Vibrancy & Accessibility Radar Tool</h2>
      <ExtendedScenarioSliders values={safeScenario} onChange={handleScenarioChange} />
      <RadarPlot data={radarData} />
      <EnergyBarPlot data={energyBarData} />
      <MetricsPanel
        populationDensity={safeScenario.populationDensity}
        amenityDensityKm2={amenityDensityKm2}
        amenityDensityPerThousand={amenityDensityPerThousand}
        diversityIndex={diversityIndex}
        groupCounts={groupCounts}
        totalAmenities={Math.round(totalAmenities)}
      />
    </div>
  );
}

export default App;
