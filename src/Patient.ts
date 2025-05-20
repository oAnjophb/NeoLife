import { StatusType } from './employes/Employee'

export class Patient {
  constructor(
    public id: number,
    public name: string,
    public cpf: string,
    public age: number,
    public gender: 'M' | 'F' | 'O',
    public address: string,
  ) {}
}
