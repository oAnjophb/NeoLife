import * as nurseRepo from '../repositories/nurseRepository'
import { NursePayload } from '../models/types'

export function registerNurse(nurse: NursePayload) {
  return nurseRepo.insertNurse(nurse)
}
