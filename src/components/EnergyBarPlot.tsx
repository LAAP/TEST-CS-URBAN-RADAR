import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export type EnergyBar = {
  name: string;
  baseline: number;
  scenario: number;
};

export type EnergyBarPlotProps = {
  data: EnergyBar[];
};

export const EnergyBarPlot: React.FC<EnergyBarPlotProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart layout="vertical" data={data} margin={{ left: 40, right: 40, top: 20, bottom: 20 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" domain={[0, 1]} />
      <YAxis type="category" dataKey="name" />
      <Tooltip />
      <Legend />
      <Bar dataKey="baseline" fill="#1976d2" name="Baseline" />
      <Bar dataKey="scenario" fill="#ff9800" name="Scenario" />
    </BarChart>
  </ResponsiveContainer>
); 