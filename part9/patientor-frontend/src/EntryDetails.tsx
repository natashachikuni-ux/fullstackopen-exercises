import { Box, Typography } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import type{ Entry } from './patientTypes';

// Exhaustive type checking helper
const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "Hospital":
      return (
        <Box sx={{ border: '2px solid black', borderRadius: '5px', padding: '10px', marginBottom: '10px' }}>
          <Typography variant="body1">
            {entry.date} <LocalHospitalIcon />
          </Typography>
          <Typography variant="body2"><em>{entry.description}</em></Typography>
          <Typography variant="body2">Discharged: {entry.discharge.date}</Typography>
          <Typography variant="body2">Diagnosed by {entry.specialist}</Typography>
        </Box>
      );
    case "OccupationalHealthcare":
      return (
        <Box sx={{ border: '2px solid black', borderRadius: '5px', padding: '10px', marginBottom: '10px' }}>
          <Typography variant="body1">
            {entry.date} <WorkIcon /> <em>{entry.employerName}</em>
          </Typography>
          <Typography variant="body2"><em>{entry.description}</em></Typography>
          <Typography variant="body2">Diagnosed by {entry.specialist}</Typography>
        </Box>
      );
    case "HealthCheck":
      return (
        <Box sx={{ border: '2px solid black', borderRadius: '5px', padding: '10px', marginBottom: '10px' }}>
          <Typography variant="body1">
            {entry.date} <MedicalServicesIcon />
          </Typography>
          <Typography variant="body2"><em>{entry.description}</em></Typography>
          <Typography variant="body2">Rating: {entry.healthCheckRating}</Typography>
          <Typography variant="body2">Diagnosed by {entry.specialist}</Typography>
        </Box>
      );
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;