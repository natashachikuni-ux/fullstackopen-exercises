import express from 'express';
import patientService from '../services/patientService';
import toNewPatient from '../utils'; // The validation function
import { EntryWithoutId } from '../types'; // <-- ADDED THIS IMPORT!

const router = express.Router();

// GET request for all patients
router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

// POST request to add a new patient (Exercise 9.12 & 9.13)
router.post('/', (req, res) => {
  try {
    const newPatientEntry = toNewPatient(req.body);
    const addedEntry = patientService.addPatient(newPatientEntry); // Only 1 argument here!
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

// GET request for a specific patient
router.get('/:id', (req, res) => {
  const patient = patientService.findById(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

// POST request to add a medical entry for a patient
router.post('/:id/entries', (req, res) => {
  try {
    // For now, we will trust the frontend data and cast it.
    // In a strict production app, you would run this through utils.ts to validate every single field!
    const entryData = req.body as EntryWithoutId;
    
    const addedEntry = patientService.addEntry(req.params.id, entryData);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;