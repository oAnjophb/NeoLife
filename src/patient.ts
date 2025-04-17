
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
    public readonly status: StatusType

    private constructor(
        name: string,
        cpf: number,
        age: number,
        id_patient: number,
        status: StatusType
    ) {
        this.name = name
        this.cpf = cpf
        this.age = age
        this.id_patient = id_patient
        this.status = status
    }

    public static register (name: string, cpf: number, age: number, id_patient: number, status: StatusType): Patient{
        return new Patient(name, cpf, age, id_patient, status)
    }

    public showInfo(): void {
        console.log (`PACIENTE: ${this.name}\nIDADE: ${this.age}\nID: ${this.id_patient}\nSTATUS: ${this.status}`)
    }
}