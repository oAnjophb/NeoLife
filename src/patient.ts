
export enum StatusType {
    in_Wait,
    in_Clinic_Care,
    finished
}

export class Patient {

    constructor(
        protected name: string,
        protected cpf: number,
        protected age: number,
        protected id_patient: number,
        protected status: StatusType
    ) {
    }
}