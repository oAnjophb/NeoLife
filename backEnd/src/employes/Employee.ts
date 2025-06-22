
export enum Positions {
  Receptionist = 'Recepcionista',
  Nurse = 'Enfermeira',
  Doctor = 'Medico',
}


export abstract class Employee {
  constructor(
    protected id: number,
    public readonly name: string,
    protected cpf: number,
    protected position: Positions,
  ) {}
}
