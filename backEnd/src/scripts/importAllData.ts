import { Database } from '../Data/data_Base_Conection'
import fs from 'fs'
import path from 'path'
import * as patientRepo from '../repositories/patientRepository'
import * as doctorRepo from '../repositories/doctorRepository'
import * as nurseRepo from '../repositories/nurseRepository'
import * as receptionistRepo from '../repositories/receptionistRepository'

function importPatients(jsonFile: string) {
  const json = fs.readFileSync(jsonFile, 'utf-8')
  const data = JSON.parse(json)
  Database.queryNone('DELETE FROM ENDERECO_PACIENTE')
  Database.queryNone('DELETE FROM PACIENTE')
  Database.queryNone('DELETE FROM ENDERECO')
  for (const p of data) patientRepo.insertPatient(p)
}

function importDoctors(jsonFile: string) {
  const json = fs.readFileSync(jsonFile, 'utf-8')
  const data = JSON.parse(json)
  doctorRepo.deleteAllDoctors()
  for (const d of data) doctorRepo.insertDoctor(d)
}

function importNurses(jsonFile: string) {
  const json = fs.readFileSync(jsonFile, 'utf-8')
  const data = JSON.parse(json)
  nurseRepo.deleteAllNurses()
  for (const n of data) nurseRepo.insertNurse(n)
}

function importReceptionists(jsonFile: string) {
  const json = fs.readFileSync(jsonFile, 'utf-8')
  const data = JSON.parse(json)
  receptionistRepo.deleteAllReceptionists()
  for (const r of data) receptionistRepo.insertReceptionist(r)
}

if (require.main === module) {
  Database.connect()
  importPatients(path.join(process.cwd(), 'JSON/pacientes.json'))
  importDoctors(path.join(process.cwd(), 'JSON/medicos.json'))
  importReceptionists(path.join(process.cwd(), 'JSON/recepcionistas.json'))
  importNurses(path.join(process.cwd(), 'JSON/enfermeiros.json'))
  Database.disconnect()
}