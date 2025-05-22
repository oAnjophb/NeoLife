import { StatusType } from '@/employes/Employee'
import { Patient } from '@/Patient'
import { RiskRating } from './triage'

export class Ticket {
  constructor(
    public paciente: Patient,
    public prioridade: RiskRating,
    public status: StatusType,
    public horarioEntrada: Date = new Date(),
  ) {}
}
