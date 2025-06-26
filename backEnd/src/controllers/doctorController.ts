import { Request, Response } from 'express'
import * as doctorService from '../services/doctorService'
import * as doctorRepo from '../repositories/doctorRepository'

export function registerDoctor(req: Request, res: Response) {
  try {
    const id = doctorService.registerDoctor(req.body)
    res.status(201).json({ id })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export function getDoctorById(req: Request, res: Response) {
  const id = Number(req.params.id)
  try {
    const doctor = doctorRepo.findDoctorById(id)
    if (!doctor) return res.status(404).json({ error: 'Doctor not found.' })
    res.json(doctor)
  } catch (error: any) {
    res
      .status(500)
      .json({ error: 'Error fetching doctor', details: error.message })
  }
}

export function listAllDoctors(_req: Request, res: Response) {
  try {
    const doctors = doctorRepo.listAllDoctors()
    res.json(doctors)
  } catch (error: any) {
    res
      .status(500)
      .json({ error: 'Error listing doctors', details: error.message })
  }
}
