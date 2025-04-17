import { Employee, position } from "./employee";
import { Patient } from "./patient";

export class Receptionist extends Employee {
    
    constructor(private readonly patients: Patient[], name: string, cpf: number, position: position) {
        super(name, cpf, position)
        
    }

    addPatients(patient: Patient): void {
        this.patients.push(patient)
    }
    perfomDuties(position: position): void {
        this.position = position
    }
    
    setName(name: string): void {
        this.name = name
    }

    setCpf(cpf: number): void {
        this.cpf = cpf
    }

    setpositon(position: position): void {
        this.position = position
    }    
    getPosition(): position {
        return this.position
    }

    showInfo(): string {
        let posit: string

        switch (this.position) {
            case position.receptionist:
                posit = position.receptionist
            break;
            
            case position.medic:
                posit = position.medic
                break;

            case position.nurse:
                posit = position.nurse
                break;
        }

        console.log(`O profissional é ${posit}`)
        
        return ''
    }
}