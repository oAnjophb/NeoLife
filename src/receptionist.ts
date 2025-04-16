import { Employee, position } from "./employee";

export class Receptionist extends Employee {
    constructor(name: string, cpf: number, position: position) {
        super(name, cpf, position)
    }

    
    perfomDuties(position: position): void {
        this.position = position
    }
    
    setName(name: string): void {
        this.name = name
    }

    setCpf(): number {
        return this.cpf
    }

    setpositon(): position {
        return this.position
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