
export enum StatusType {
    in_Wait = "Esperando",
    in_Clinic_Care = 'Atendimento',
    finished = 'Finalizado'
}

export class Patient {

    constructor(
        protected name: string,
        protected cpf: number,
        protected age: number,
        protected id_patient: number,
        private readonly status: StatusType
    ) {
    }
}