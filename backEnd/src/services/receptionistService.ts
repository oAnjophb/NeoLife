import * as receptionistRepo from '../repositories/receptionistRepository'
import { ReceptionistPayload } from '../models/types'

export function registerReceptionist(recep: ReceptionistPayload) {
  return receptionistRepo.insertReceptionist(recep)
}
