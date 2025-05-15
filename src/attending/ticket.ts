import { RiskRating } from '@/employes/Nurse';
import { Patient } from '@/Patient'

export class Ticket {
  constructor(
    public paciente: Patient,
    public prioridade: RiskRating,
    public horarioEntrada: Date = new Date(),
  ) {}
}
