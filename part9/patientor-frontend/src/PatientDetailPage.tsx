import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, Button } from '@mui/material';
import type { Patient, Diagnosis, EntryWithoutId } from './patientTypes';
import EntryDetails from './EntryDetails';
import AddEntryForm from './AddEntryForm';

const apiBaseUrl = 'http://localhost:3001/api';

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  
  // New state for the form
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchPatientAndDiagnoses = async () => {
      try {
        const patientResponse = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        setPatient(patientResponse.data);

        const diagnosesResponse = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
        setDiagnoses(diagnosesResponse.data);
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    };
    
    if (id) {
      void fetchPatientAndDiagnoses();
    }
  }, [id]);

  // THIS IS THE NEW SUBMIT FUNCTION
  const submitNewEntry = async (values: EntryWithoutId) => {
    try {
      const { data: newEntry } = await axios.post(`${apiBaseUrl}/patients/${id}/entries`, values);
      
      // Update the patient state with the new entry so it appears immediately!
      if (patient) {
        setPatient({ ...patient, entries: patient.entries.concat(newEntry) });
      }
      setFormVisible(false);
      setError(undefined);
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response?.data && typeof e.response?.data === "string") {
        setError(e.response.data);
      } else {
        setError("Unrecognized axios error");
      }
    }
  };

  if (!patient) {
    return <Typography sx={{ padding: '20px' }}>Loading patient data...</Typography>;
  }

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '0.5em', fontWeight: 'bold' }}>
        {patient.name}
      </Typography>
      <Typography variant="body1"><strong>Gender:</strong> {patient.gender}</Typography>
      <Typography variant="body1"><strong>SSN:</strong> {patient.ssn}</Typography>
      <Typography variant="body1"><strong>Occupation:</strong> {patient.occupation}</Typography>

      {/* FORM SECTION */}
     {formVisible ? (
        <AddEntryForm 
          onSubmit={submitNewEntry} 
          onCancel={() => setFormVisible(false)} 
          error={error} 
          diagnoses={diagnoses} // <-- ADD THIS LINE!
        />
      ) : (
        <Button variant="contained" color="primary" onClick={() => setFormVisible(true)} sx={{ marginTop: '1em' }}>
          Add New Entry
        </Button>
      )}

      <Typography variant="h5" sx={{ marginTop: '1em', marginBottom: '0.5em', fontWeight: 'bold' }}>
        entries
      </Typography>
      
      {patient.entries && patient.entries.length > 0 ? (
        patient.entries.map(entry => (
          <Box key={entry.id} sx={{ marginBottom: '1em' }}>
            <EntryDetails entry={entry} />
            {entry.diagnosisCodes && (
              <ul>
                {entry.diagnosisCodes.map(code => {
                  const matchingDiagnosis = diagnoses.find(d => d.code === code);
                  return (
                    <li key={code}>
                      {code} {matchingDiagnosis ? matchingDiagnosis.name : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </Box>
        ))
      ) : (
        <Typography variant="body2">No entries found for this patient.</Typography>
      )}
    </Box>
  );
};

export default PatientDetailPage;