import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer } from 'recharts';

export type RadarKPI = {
  axis: string;
  baseline: number;
  scenario: number;
};

export type RadarPlotProps = {
  data: RadarKPI[];
};

// Map normalized values (-1 to 1) to -100 to 100 for display
function mapTo100(val: number) {
  return val * 100;
}

export const RadarPlot: React.FC<RadarPlotProps> = ({ data }) => {
  // Map data to -100 to 100
  const mappedData = data.map(d => ({
    axis: d.axis,
    baseline: mapTo100(d.baseline),
    scenario: mapTo100(d.scenario),
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mappedData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="axis" />
        <PolarRadiusAxis angle={30} domain={[-100, 100]} tickCount={5} />
        <Radar name="Baseline" dataKey="baseline" stroke="#1976d2" fill="#1976d2" fillOpacity={0.3} />
        <Radar name="Scenario" dataKey="scenario" stroke="#ff9800" fill="#ff9800" fillOpacity={0.3} />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
}; 