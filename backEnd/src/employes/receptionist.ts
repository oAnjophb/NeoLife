import { Patient } from '@/Patient'
import { Employee, Positions } from './Employee'

export class receptionist extends Employee {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly cpf: number,
  ) {
    super(id, name, cpf, Positions.Receptionist)
  }
}
