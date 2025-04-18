
import { Positions } from "./employee";
import { Nurse, riskRating } from "./nurse";
import { StatusType } from "./patient";
import { Receptionist } from "./receptionist";

const ana = new Receptionist('Ana', 1122, Positions.receptionist)
const andre = new Nurse('Andre', 1213, Positions.nurse)

const maria = ana.registerPatient('maria', 1234, 10, 1, StatusType.in_Wait)

andre.sendToCare(maria, 35, 50, 12/8, riskRating.green)


// ana.showInfo()      // Informações da RECEPCIONISTA "ANA"
// maria.showInfo()    // Informações da PACIENTE "MARIA"
andre.showQueueToCare()