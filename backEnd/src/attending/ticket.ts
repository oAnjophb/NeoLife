import { Patient } from '@/Patient'
import { RiskRating } from './triage'

export enum StatusType {
  waitingTriage = 'Aguardando Triagem',
  inTriage = 'Em Triagem',
  readyForConsult = 'Pronto Para Consulta',
  inConsult = 'Em Atendimento',
  finished = 'Finalizado',
  cancel = 'Cancelado',
}

export class Ticket {
  constructor(
    public paciente: Patient,
    public prioridade: RiskRating,
    public status: StatusType,
    public data_triagem: Date = new Date(),
  ) {}
}
