
export enum Positions {
    receptionist = "Recepcionista",
    medic = "Médico",
    nurse = "Enfermeira"
}

export abstract class Employee {

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