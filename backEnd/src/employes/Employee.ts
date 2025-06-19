
export enum Positions {
  Receptionist = 'Recepcionista',
  Nurse = 'Enfermeira',
  Doctor = 'Medico',
}

export enum StatusType {
  waitingTriage = 'Aguardando Triagem',
  inTriage = 'Em Triagem',
  readyForConsult = 'Pronto Para Consulta',
  inConsult = 'Em Atendimento',
  finished = 'Finalizado',
  cancel = 'Cancelado',
}

export abstract class Employee {
  constructor(
    protected id: number,
    public readonly name: string,
    protected cpf: number,
    protected position: Positions,
  ) {}
}
