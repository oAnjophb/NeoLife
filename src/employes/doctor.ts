import { Patient } from '@/Patient'
import { Employee, Positions, StatusType } from './Employee'

export class Doctor extends Employee {
  constructor(
    id: number,
    cpf: number,
    public readonly name: string,
    public readonly crm: string,
  ) {
    super(id, name, cpf, Positions.Doctor)
  }
}
