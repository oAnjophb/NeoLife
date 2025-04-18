
export enum Positions { // Cargos
    receptionist = "Recepcionista",
    medic = "Médico",
    nurse = "Enfermeira"
}

export abstract class Employee { // Funcionario

    constructor (
        protected name: string,
        protected cpf: number,
        protected position: Positions
    ) {
    }
    
    public showInfo(): void {
        console.log(`NOME: ${this.name}\nCPF: ${this.cpf}\nCARGO: ${this.position}\n`)
    }
}