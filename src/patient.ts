
export enum StatusType {
    in_Wait = "Esperando",
    in_Clinic_Care = 'Atendimento',
    finished = 'Finalizado'
}

export class Patient {
    public readonly name: string
    public readonly cpf: number
    public readonly age: number
    public readonly id_patient: number

    private constructor(
        name: string,
        cpf: number,
        age: number,
        id_patient: number,
    ) {
        this.name = name
        this.cpf = cpf
        this.age = age
        this.id_patient = id_patient
    }

    public static register (name: string, cpf: number, age: number, id_patient: number): Patient{
        return new Patient(name, cpf, age, id_patient)
    }

    public showInfo(): void {
        console.log (`PACIENTE: ${this.name}\nIDADE: ${this.age}\nID: ${this.id_patient}`)
    }
}