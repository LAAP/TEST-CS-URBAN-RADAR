import React from 'react';
import { Box, Slider, Typography, Grid } from '@mui/material';

// Helper: clamp to slider range
const clampSlider = (val: any, min: number, max: number, fallback: number) =>
  Number.isFinite(val) && val >= min && val <= max ? val : fallback;

export type DemographicSlidersProps = {
  values: {
    students: number;
    entrepreneurs: number;
    workers: number;
    families: number;
    highIncome: number;
    populationDensity: number;
  };
  onChange: (values: DemographicSlidersProps['values']) => void;
};

const marks = [
  { value: 0, label: '0%' },
  { value: 0.5, label: '50%' },
];

export const ScenarioSliders: React.FC<DemographicSlidersProps> = ({ values, onChange }) => {
  // Universal guard: only render sliders if all values are valid numbers
  const allValid = [
    values.students,
    values.entrepreneurs,
    values.workers,
    values.families,
    values.highIncome,
    values.populationDensity
  ].every(val => Number.isFinite(val) && val !== null && val !== undefined);

  if (!allValid) return <div>Loading sliders...</div>;

  // Handler for demographic sliders
  const handleSlider = (key: keyof Omit<DemographicSlidersProps['values'], 'populationDensity'>, newValue: number) => {
    const updated = { ...values, [key]: newValue };
    // Normalize so sum = 1
    const sum = updated.students + updated.entrepreneurs + updated.workers + updated.families + updated.highIncome;
    if (sum !== 1) {
      Object.keys(updated).forEach(k => {
        if (k !== 'populationDensity') {
          updated[k as keyof typeof updated] = updated[k as keyof typeof updated] / sum;
        }
      });
    }
    onChange(updated);
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2, mb: 2 }}>
      <Typography variant="h6">Demographic Profile</Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography gutterBottom>Students</Typography>
          <Slider
            value={clampSlider(values.students, 0, 0.5, 0.15)}
            min={0}
            max={0.5}
            step={0.01}
            marks={marks}
            onChange={(_, v) => handleSlider('students', v as number)}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography gutterBottom>Entrepreneurs</Typography>
          <Slider
            value={clampSlider(values.entrepreneurs, 0, 0.5, 0.1)}
            min={0}
            max={0.5}
            step={0.01}
            marks={marks}
            onChange={(_, v) => handleSlider('entrepreneurs', v as number)}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography gutterBottom>Workers</Typography>
          <Slider
            value={clampSlider(values.workers, 0, 0.5, 0.35)}
            min={0}
            max={0.5}
            step={0.01}
            marks={marks}
            onChange={(_, v) => handleSlider('workers', v as number)}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography gutterBottom>Families</Typography>
          <Slider
            value={clampSlider(values.families, 0, 0.5, 0.3)}
            min={0}
            max={0.5}
            step={0.01}
            marks={marks}
            onChange={(_, v) => handleSlider('families', v as number)}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography gutterBottom>High Income</Typography>
          <Slider
            value={clampSlider(values.highIncome, 0, 0.5, 0.1)}
            min={0}
            max={0.5}
            step={0.01}
            marks={marks}
            onChange={(_, v) => handleSlider('highIncome', v as number)}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid size={12}>
          <Typography variant="h6" sx={{ mt: 2 }}>Population Density</Typography>
          <Slider
            value={clampSlider(values.populationDensity, 2000, 20000, 7000)}
            min={2000}
            max={20000}
            step={100}
            marks={[{ value: 2000, label: '2,000' }, { value: 20000, label: '20,000' }]}
            onChange={(_, v) => onChange({ ...values, populationDensity: Number(v) })}
            valueLabelDisplay="auto"
          />
        </Grid>
      </Grid>
    </Box>
  );
}; 