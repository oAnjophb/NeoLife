import { Patient } from '@/Patient'
import { Employee, Positions } from './Employee'

export enum RiskRating {
  azul = 4,
  verde = 3,
  amarelo = 2,
  laranja = 1,
  vermelho = 0,
}

export class Nurse extends Employee {
  constructor(
    public readonly coren: string,
    public readonly id: number,
    public readonly name: string,
    public readonly cpf: number,
  ) {
    super(id, name, cpf, Positions.Nurse)
  }

  realizeTrigem(Patient: Patient) {}
}
