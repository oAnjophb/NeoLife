import { Employee, Positions } from "./employee";
import { Patient, StatusType } from "./patient";

export class Receptionist extends Employee {

    public readonly patientQueue: Patient[] = []
    
    constructor(name: string, cpf: number, position: Positions) {
        super(name, cpf, position)

        this.patientQueue = []
    }

    registerPatient(name: string, cpf: number, age: number, id_patient: number, StatusType: StatusType): Patient {
        let paciente = Patient.register(name, cpf, age, id_patient, StatusType)
        this.patientQueue.push(paciente)
        
        return paciente
    }
}