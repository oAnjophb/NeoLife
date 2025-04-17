
import { Positions } from "./employee";
import { StatusType } from "./patient";
import { Receptionist } from "./receptionist";

const ana = new Receptionist('Ana', 1122, Positions.receptionist)

const maria = ana.registerPatient('maria', 1234, 10, 1, StatusType.in_Wait)

ana.showInfo()      // Informações da RECEPCIONISTA "ANA"
maria.showInfo()    // Informações da PACIENTE "MARIA"