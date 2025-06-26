import { Request, Response } from 'express'
import * as nurseService from '../services/nurseService'
import * as nurseRepo from '../repositories/nurseRepository'

export function registerNurse(req: Request, res: Response) {
  try {
    const id = nurseService.registerNurse(req.body)
    res.status(201).json({ id })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export function getNurseById(req: Request, res: Response) {
  const id = Number(req.params.id)
  try {
    const nurse = nurseRepo.findNurseById(id)
    if (!nurse) return res.status(404).json({ error: 'Nurse not found.' })
    res.json(nurse)
  } catch (error: any) {
    res
      .status(500)
      .json({ error: 'Error fetching nurse', details: error.message })
  }
}

export function listAllNurses(_req: Request, res: Response) {
  try {
    const nurses = nurseRepo.listAllNurses()
    res.json(nurses)
  } catch (error: any) {
    res
      .status(500)
      .json({ error: 'Error listing nurses', details: error.message })
  }
}
