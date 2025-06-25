import { Patient } from '@/models/Patient'
import { Employee, Positions } from './Employee'

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
