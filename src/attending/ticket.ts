import { StatusType } from '@/employes/Employee'
import { RiskRating } from '@/employes/Nurse'
import { Patient } from '@/Patient'

export class Ticket {
  constructor(
    public paciente: Patient,
    public prioridade: RiskRating,
    public status: StatusType,
    public horarioEntrada: Date = new Date(),
  ) {}
}
