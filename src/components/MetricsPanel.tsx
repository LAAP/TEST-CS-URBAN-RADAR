import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableRow } from '@mui/material';

export type MetricsPanelProps = {
  populationDensity: number;
  amenityDensityKm2: number;
  amenityDensityPerThousand: number;
  diversityIndex: number;
  groupCounts: { [key: string]: number };
  totalAmenities: number;
};

export const MetricsPanel: React.FC<MetricsPanelProps> = ({
  populationDensity,
  amenityDensityKm2,
  amenityDensityPerThousand,
  diversityIndex,
  groupCounts,
  totalAmenities,
}) => (
  <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2, mt: 2 }}>
    <Typography variant="h6">Live KPI Metrics</Typography>
    <Table size="small">
      <TableBody>
        <TableRow>
          <TableCell>Population Density</TableCell>
          <TableCell>{populationDensity.toLocaleString()} people/km²</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Amenity Density (per km²)</TableCell>
          <TableCell>{amenityDensityKm2.toFixed(2)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Amenity Density (per 1,000 people)</TableCell>
          <TableCell>{amenityDensityPerThousand.toFixed(2)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Diversity Index</TableCell>
          <TableCell>{diversityIndex.toFixed(3)}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Total Amenities</TableCell>
          <TableCell>{totalAmenities.toLocaleString()}</TableCell>
        </TableRow>
        {Object.entries(groupCounts).map(([group, count]) => (
          <TableRow key={group}>
            <TableCell>{group.charAt(0).toUpperCase() + group.slice(1)}</TableCell>
            <TableCell>{count.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
); 