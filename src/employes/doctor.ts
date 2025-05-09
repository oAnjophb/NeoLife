import { Patient } from "@/Patient";
import { Employee, Positions, StatusType } from "./Employee";

export class Doctor extends Employee {
  constructor(
    id: number,
    name: string,
    cpf: number,
    public crm: string,
    position: Positions
  ) {
    super(id, name, cpf, Positions.Doctor);
  }
}
