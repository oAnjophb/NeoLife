
import { position } from "./employee";
import { Patient, StatusType } from "./patient";
import { Receptionist } from "./receptionist";

const maria = new Patient('maria', 112233, 29, 1, StatusType.in_Wait)
let pacientes = [maria]

const ana = new Receptionist(pacientes, 'ana', 223311, position.receptionist)

ana.showInfo()
