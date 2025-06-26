import fs from 'fs'
import path from 'path'
import { PatientPayload, AttendanceRow } from '../models/types'

const dbFile = path.join(process.cwd(), 'JSON/pacientes.json')

export function savePatientToJson(newPatient: PatientPayload) {
  let patients: any[] = []
  if (fs.existsSync(dbFile)) {
    try {
      patients = JSON.parse(fs.readFileSync(dbFile, 'utf-8'))
    } catch {
      patients = []
    }
  }
  const patientWithId = {
    ...newPatient,
    id: Date.now(),
  }
  patients.push(patientWithId)
  fs.writeFileSync(dbFile, JSON.stringify(patients, null, 2), 'utf-8')
  return patientWithId
}

export function normalizePatientPayload(payload: PatientPayload) {
  if (payload.data_nascimento && !payload.birth_date) {
    payload.birth_date = payload.data_nascimento
    delete payload.data_nascimento
  }
  if (!payload.address && payload.endereco) {
    payload.address = payload.endereco
    delete payload.endereco
  }
  return payload
}

export function calculateAge(birth_date: string): number {
  if (!birth_date) return 0
  const birth = new Date(birth_date)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

export function buildAddress(row: AttendanceRow): string {
  if (!row.rua) return ''
  return `${row.rua}${row.numero ? ', ' + row.numero : ''}${row.bairro ? ' - ' + row.bairro : ''}${row.cidade ? ', ' + row.cidade : ''}${row.estado ? ' - ' + row.estado : ''}${row.cep ? ', CEP: ' + row.cep : ''}`
}