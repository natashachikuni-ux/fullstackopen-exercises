import { useState, SyntheticEvent } from 'react';
import { TextField, Button, Grid, Typography, Box, Select, MenuItem, InputLabel, FormControl, OutlinedInput, Chip } from '@mui/material';
import type{ SelectChangeEvent } from '@mui/material/Select';
import type { EntryWithoutId, Diagnosis } from './patientTypes';

interface Props {
  onSubmit: (values: EntryWithoutId) => void;
  onCancel: () => void;
  error?: string;
  diagnoses: Diagnosis[]; // We accept the diagnoses array here now!
}

const AddEntryForm = ({ onSubmit, onCancel, error, diagnoses }: Props) => {
  const [type, setType] = useState<"HealthCheck" | "Hospital" | "OccupationalHealthcare">("HealthCheck");

  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  
  // Diagnosis codes is now an array of strings
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  // Default to '0' (Healthy)
  const [healthCheckRating, setHealthCheckRating] = useState('0');

  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');

  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');

  // Helper function for the multiple select dropdown
  const handleDiagnosisChange = (event: SelectChangeEvent<typeof diagnosisCodes>) => {
    const { target: { value } } = event;
    setDiagnosisCodes(typeof value === 'string' ? value.split(',') : value);
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    const baseEntry = {
      description,
      date,
      specialist,
      diagnosisCodes
    };

    if (type === "HealthCheck") {
      onSubmit({
        ...baseEntry,
        type: "HealthCheck",
        healthCheckRating: Number(healthCheckRating)
      });
    } else if (type === "Hospital") {
      onSubmit({
        ...baseEntry,
        type: "Hospital",
        discharge: { date: dischargeDate, criteria: dischargeCriteria }
      });
    } else if (type === "OccupationalHealthcare") {
      onSubmit({
        ...baseEntry,
        type: "OccupationalHealthcare",
        employerName,
        ...(sickLeaveStart && sickLeaveEnd ? { sickLeave: { startDate: sickLeaveStart, endDate: sickLeaveEnd } } : {})
      });
    }
  };

  return (
    <Box sx={{ border: '2px dotted black', padding: '1em', marginBottom: '2em', marginTop: '2em' }}>
      <Typography variant="h6" sx={{ marginBottom: '1em', fontWeight: 'bold' }}>
        New Entry
      </Typography>

      {error && <Typography color="error" sx={{ marginBottom: '1em' }}>{error}</Typography>}

      <form onSubmit={addEntry}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Entry Type</InputLabel>
          <Select value={type} label="Entry Type" onChange={({ target }) => setType(target.value as any)}>
            <MenuItem value="HealthCheck">Health Check</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
            <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
          </Select>
        </FormControl>

        <TextField label="Description" fullWidth value={description} onChange={({ target }) => setDescription(target.value)} sx={{ mb: 2 }} />
        
        {/* MAGIC DATE PICKER */}
        <TextField type="date" label="Date" fullWidth InputLabelProps={{ shrink: true }} value={date} onChange={({ target }) => setDate(target.value)} sx={{ mb: 2 }} />
        
        <TextField label="Specialist" fullWidth value={specialist} onChange={({ target }) => setSpecialist(target.value)} sx={{ mb: 2 }} />

        {/* MAGIC MULTIPLE SELECT DIAGNOSIS CODES */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Diagnosis Codes</InputLabel>
          <Select
            multiple
            value={diagnosisCodes}
            onChange={handleDiagnosisChange}
            input={<OutlinedInput label="Diagnosis Codes" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {diagnoses.map((d) => (
              <MenuItem key={d.code} value={d.code}>
                {d.code} - {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {type === "HealthCheck" && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Health Check Rating</InputLabel>
            <Select value={healthCheckRating} label="Health Check Rating" onChange={({ target }) => setHealthCheckRating(target.value as string)}>
              <MenuItem value="0">0 - Healthy</MenuItem>
              <MenuItem value="1">1 - Low Risk</MenuItem>
              <MenuItem value="2">2 - High Risk</MenuItem>
              <MenuItem value="3">3 - Critical Risk</MenuItem>
            </Select>
          </FormControl>
        )}

        {type === "Hospital" && (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'gray' }}>Discharge Information</Typography>
            <TextField type="date" label="Discharge Date" fullWidth InputLabelProps={{ shrink: true }} value={dischargeDate} onChange={({ target }) => setDischargeDate(target.value)} sx={{ mb: 2 }} />
            <TextField label="Discharge Criteria" fullWidth value={dischargeCriteria} onChange={({ target }) => setDischargeCriteria(target.value)} sx={{ mb: 2 }} />
          </>
        )}

        {type === "OccupationalHealthcare" && (
          <>
            <TextField label="Employer Name" fullWidth value={employerName} onChange={({ target }) => setEmployerName(target.value)} sx={{ mb: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'gray' }}>Sick Leave (Optional)</Typography>
            <TextField type="date" label="Start Date" fullWidth InputLabelProps={{ shrink: true }} value={sickLeaveStart} onChange={({ target }) => setSickLeaveStart(target.value)} sx={{ mb: 2 }} />
            <TextField type="date" label="End Date" fullWidth InputLabelProps={{ shrink: true }} value={sickLeaveEnd} onChange={({ target }) => setSickLeaveEnd(target.value)} sx={{ mb: 2 }} />
          </>
        )}

        <Grid container justifyContent="space-between">
          <Grid item>
            <Button color="error" variant="contained" type="button" onClick={onCancel}>
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button color="primary" variant="contained" type="submit">
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddEntryForm;