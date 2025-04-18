import { riskRating } from "./nurse"

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
    public status: StatusType
    public temp: number
    public saturation: number 
    public press: number
    public riskRating: riskRating 

    private constructor(
        name: string,
        cpf: number,
        age: number,
        id_patient: number,
        status: StatusType,
        temp: number,
        saturation: number,
        press: number, 
        riskRating: riskRating, 
    ) {
        this.name = name
        this.cpf = cpf
        this.age = age
        this.id_patient = id_patient
        this.status = status
        this.temp = temp
        this.saturation = saturation
        this.press = press
        this.riskRating = riskRating
    }

    public static register (
        name: string, 
        cpf: number, 
        age: number, 
        id_patient: number, 
        status: StatusType, 
        temp: number,
        saturation: number,
        press: number, 
        riskRating: riskRating,
    ): Patient{    
            return new Patient(name, cpf, age, id_patient, status, temp, saturation, press, riskRating)
    }

    getName(): void {
        console.log(`${this.name}`)
    }

    public uptadeHealthInfo(temp: number, saturation: number, press: number, riskRating: riskRating): void {
        this.temp = temp;
        this.saturation = saturation;
        this.press = press;
        this.riskRating = riskRating;
    }

    public showInfo(): void {
        console.log (`PACIENTE: ${this.name}\nIDADE: ${this.age}\nID: ${this.id_patient}\nSTATUS: ${this.status}`)
    }
}