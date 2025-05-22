export class Patient {
  constructor(
    public id: number,
    public name: string,
    public cpf: string,
    public age: number,
    public gender: 'M' | 'F' ,
    public address: string,
    public entryTime: Date,
  ) {}
}
