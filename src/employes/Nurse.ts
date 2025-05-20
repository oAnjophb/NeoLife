import { Employee, Positions } from './Employee'

export enum RiskRating {
  blue = 1,
  grenn = 2,
  yellow = 3,
  orange = 4,
  Red = 5,
}

export class Nurse extends Employee {
  constructor(
    protected coren: string,
    id: number,
    name: string,
    cpf: number,
    position: Positions,
  ) {
    super(id, name, cpf, Positions.Nurse)
  }
}
