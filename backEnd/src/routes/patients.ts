import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

const dbPath = path.join(process.cwd(), 'JSON/patients.json');

interface Patient {
  id: number;
  [key: string]: any;
}

function readPatients(): Patient[] {
  if (!fs.existsSync(dbPath)) return [];
  const data = fs.readFileSync(dbPath, 'utf-8');
  try { return JSON.parse(data); } catch { return []; }
}

function savePatients(patients: Patient[]): void {
  fs.writeFileSync(dbPath, JSON.stringify(patients, null, 2), 'utf-8');
}


router.get('/', (req, res) => {
  const patients = readPatients();
  res.json(patients);
});

router.post('/', (req, res) => {
  try {
    const patients = readPatients();
    // Gera um id único
    const newPatient: Patient = { ...req.body, id: Date.now() };
    patients.push(newPatient);
    savePatients(patients);
    // Retorna o paciente criado (com id)
    res.status(201).json(newPatient);
  } catch (err) {
    console.log('Error saving patient', err)
    res.status(500).json({ error: 'Error saving patient', details: err });
  }
});

router.get('/:id', (req, res) => {
  const patients = readPatients();
  const patient = patients.find((p) => String(p.id) === req.params.id);
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  res.json(patient);
});

router.put('/:id', (req, res) => {
  try {
    const patients = readPatients();
    const index = patients.findIndex((p) => String(p.id) === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Patient not found' });
    patients[index] = { ...patients[index], ...req.body, id: patients[index].id };
    savePatients(patients);
    res.json(patients[index]);
  } catch (err) {
    res.status(500).json({ error: 'Error updating patient', details: err });
  }
});

router.delete('/:id', (req, res) => {
  try {
    let patients = readPatients();
    const initialLength = patients.length;
    patients = patients.filter((p) => String(p.id) !== req.params.id);
    if (patients.length === initialLength)
      return res.status(404).json({ error: 'Patient not found' });
    savePatients(patients);
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting patient', details: err });
  }
});

export default router;