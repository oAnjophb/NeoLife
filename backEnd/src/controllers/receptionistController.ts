import { Request, Response } from 'express'
import * as receptionistService from '../services/receptionistService'
import * as receptionistRepo from '../repositories/receptionistRepository'

export function registerReceptionist(req: Request, res: Response) {
  try {
    const id = receptionistService.registerReceptionist(req.body)
    res.status(201).json({ id })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export function getReceptionistById(req: Request, res: Response) {
  const id = Number(req.params.id)
  try {
    const recep = receptionistRepo.findReceptionistById(id)
    if (!recep)
      return res.status(404).json({ error: 'Receptionist not found.' })
    res.json(recep)
  } catch (error: any) {
    res
      .status(500)
      .json({ error: 'Error fetching receptionist', details: error.message })
  }
}

export function listAllReceptionists(_req: Request, res: Response) {
  try {
    const receps = receptionistRepo.listAllReceptionists()
    res.json(receps)
  } catch (error: any) {
    res
      .status(500)
      .json({ error: 'Error listing receptionists', details: error.message })
  }
}
