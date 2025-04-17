
export enum position {
    receptionist = "Recepcionista",
    medic = "Médico",
    nurse = "Enfermeira"
}

export abstract class Employee {

    constructor (
        protected name: string,
        protected cpf: number,
        protected position: position
    ) {
    }

    abstract setName(name: string): void;
    abstract setCpf(cpf: number): void;
    abstract perfomDuties(position: position): void;
    abstract getPosition(): position;
    abstract showInfo(): string;
}