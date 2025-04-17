
export enum StatusType {
    in_Wait = "Esperando",
    in_Clinic_Care = 'Atendimento',
    finished = 'Finalizado'
}

export class Patient {

    constructor(
        public readonly name: string,
        public readonly cpf: number,
        public readonly age: number,
        public readonly id_patient: number,
        public readonly status: StatusType
    ) {
    }

    
}