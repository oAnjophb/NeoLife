
enum id_types {
    receptionist,
    medic,
    nurse
}

export abstract class Employee {

    constructor (
        protected name: string,
        protected cargo: string,
        protected cpf: number,
        protected id_types: id_types
    ) {
    }

    abstract setName: number;
}