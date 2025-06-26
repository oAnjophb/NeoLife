import * as doctorRepo from '../repositories/doctorRepository'
import { DoctorPayload } from '../models/types'

export function registerDoctor(doctor: DoctorPayload) {
  return doctorRepo.insertDoctor(doctor)
}
