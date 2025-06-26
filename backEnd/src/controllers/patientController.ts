import { Request, Response } from 'express'
import * as patientService from '../services/patientService'
import * as patientRepo from '../repositories/patientRepository'
import fs from 'fs'
import path from 'path'

export async function registerPatient(req: Request, res: Response) {
  try {
    const result = await patientService.registerPatient(req.body)
    res.status(201).json(result)
  } catch (error: any) {
    res
      .status(
        error.message === 'A patient with this CPF already exists.' ? 409 : 500,
      )
      .json({ error: error.message })
  }
}

export function getByCPF(req: Request, res: Response) {
  const { cpf } = req.params
  try {
    const patient = patientRepo.findPatientByCPF(cpf)
    if (!patient) return res.status(404).json({ error: 'Patient not found.' })
    res.json(patient)
  } catch (error: any) {
    res
      .status(500)
      .json({ error: 'Error fetching patient', details: error.message })
  }
}

export function getById(req: Request, res: Response) {
  const id = Number(req.params.id_paciente)
  let patient = null
  try {
    patient = patientRepo.findPatientById(id)
  } catch (error) {
    console.error('Error fetching patient in DB:', error)
  }
  if (!patient) {
    const dbFile = path.join(process.cwd(), 'JSON/pacientes.json')
    if (fs.existsSync(dbFile)) {
      try {
        const patients: any[] = JSON.parse(fs.readFileSync(dbFile, 'utf-8'))
        patient = patients.find((p) => p.id == id || p.id_paciente == id)
      } catch (error) {
        console.error('Error reading patients JSON:', error)
      }
    }
  }
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' })
  }
  res.json(patient)
}

export function updatePatient(req: Request, res: Response) {
  const { id_patient } = req.params
  const { nome, data_nascimento, genero } = req.body
  try {
    patientRepo.updatePatient(Number(id_patient), {
      nome,
      data_nascimento,
      genero,
    })
    res.json({ message: 'Patient updated successfully.' })
  } catch (error: any) {
    res
      .status(500)
      .json({ error: 'Error updating patient', details: error.message })
  }
}

export async function startAttendance(req: Request, res: Response) {
  const idPaciente = req.body.id_paciente
  if (!idPaciente) {
    return res.status(400).json({ error: 'id_paciente não informado' })
  }
  try {
    const result = await patientService.startAttendance(idPaciente)
    console.log('startAttendance result:', result)
    res.status(201).json(result)
  } catch (error: any) {
    console.error('Erro ao iniciar atendimento:', error)
    res
      .status(500)
      .json({ error: 'Error starting attendance', details: error.message })
  }
}
export function searchPatients(req: Request, res: Response) {
  const searchRaw = req.query.search
  const search =
    typeof searchRaw === 'string' ? searchRaw.replace(/\D/g, '') : ''
  if (search && search.length >= 3) {
    try {
      const results = patientService.searchPatientsByCPF(search)
      return res.json(results)
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: 'Error searching patients', details: error.message })
    }
  }
  return res.json([])
}

export function ping(_: Request, res: Response) {
  res.json({ ok: true })
}

export function listAllPatients(req: Request, res: Response) {
  try {
    const pacientes = patientRepo.listAllPatients()
    res.json(pacientes)
  } catch (error: any) {
    res
      .status(500)
      .json({ error: 'Erro ao buscar pacientes', details: error.message })
  }
}
