import { v4 as uuid } from 'uuid';
import { Patient, NonSensitivePatient, NewPatient, EntryWithoutId, Entry } from '../types';
import patientsData from '../data/patients.json';

const patients: Patient[] = patientsData as Patient[];

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, entry: EntryWithoutId): Entry => {
  const patient = patients.find(p => p.id === patientId);
  if (!patient) {
    throw new Error('Patient not found');
  }

  const newEntry = {
    id: uuid(),
    ...entry
  };

  patient.entries.push(newEntry);
  return newEntry;
};

// Here is the new function
const findById = (id: string): Patient | undefined => {
  const patient = patients.find(p => p.id === id);
  return patient;
};

// ONE single export default at the very bottom!
export default {
  getNonSensitiveEntries,
  addPatient,
  findById,
  addEntry
};