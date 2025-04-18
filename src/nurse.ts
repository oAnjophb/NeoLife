import { Employee, Positions } from "./employee"
import { Patient, StatusType } from "./patient"

export enum riskRating {
    blue = 240,
    green = 120,
    yellow = 60,
    orange = 10,
    red = "IMEDIATO"
}

export class Nurse extends Employee {

    public readonly serviceQueue: Patient[] = []
    
    constructor(name: string, cpf: number, position: Positions) {
        super(name, cpf, position)

        this.serviceQueue = []
    }

    sendToCare(
        patient: Patient,
        temp: number,
        saturation: number,
        press: number,
        riskRating: riskRating
    ): Patient {

        patient.uptadeHealthInfo(temp, saturation, press, riskRating)
        patient.status = StatusType.in_Wait
        this.serviceQueue.push(patient)
        return patient
    }

    showQueueToCare(): void {

        console.log('-'.repeat(15))
        console.log(`PACIENTES EM ESPERA DE ATENDIMENTO:\n`)
        
        if (this.serviceQueue.length > 0) {
            this.serviceQueue.forEach(Patient => Patient.getName())
        }
        else {
        console.log("Nenhum paciente na fila de atendimento.")
        }
    }
}