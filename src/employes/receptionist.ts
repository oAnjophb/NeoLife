import { Employee, Positions } from "./Employee";

export class receptionist extends Employee {
  constructor(id: number, name: string, cpf: number, postion: Positions) {
    super(id, name, cpf, Positions.Receptionist);
  }
}
