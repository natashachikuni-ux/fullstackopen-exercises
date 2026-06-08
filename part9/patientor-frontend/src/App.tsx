import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import type { Patient } from "./patientTypes";
import PatientDetailPage from "./PatientDetailPage"; // Import our new page!

import { 
  Box, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Button
} from '@mui/material';

const apiBaseUrl = 'http://localhost:3001/api';

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchPatientList = async () => {
      try {
        const { data: patientListFromApi } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);
        setPatients(patientListFromApi);
      } catch (e) {
        console.error("Error fetching patients:", e);
      }
    };
    void fetchPatientList();
  }, []);

  return (
    <Router>
      <Box sx={{ padding: '20px' }}>
        {/* We can add a simple navigation button at the top */}
        <Button component={Link} to="/" variant="contained" sx={{ mb: 3 }}>
          Home
        </Button>

        <Typography variant="h4" sx={{ marginBottom: '0.5em' }}>
          Patientor
        </Typography>
        
        {/* The Routes component decides which page to show based on the URL */}
        <Routes>
          {/* ROUTE 1: The Home Page (The Table) */}
          <Route path="/" element={
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Gender</strong></TableCell>
                    <TableCell><strong>Occupation</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        {/* Make the name clickable using React Router's Link */}
                        <Link to={`/patients/${patient.id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                          {patient.name}
                        </Link>
                      </TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.occupation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          } />

          {/* ROUTE 2: The Individual Patient Page */}
          <Route path="/patients/:id" element={<PatientDetailPage />} />
        </Routes>

      </Box>
    </Router>
  );
};

export default App;