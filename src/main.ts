
import { position } from "./employee";
import { Patient, StatusType } from "./patient";
import { Receptionist } from "./receptionist";

const ana = new Receptionist('ana', 1122, position.receptionist)

const maria = ana.registerPatient('maria', 1234, 10, 1, StatusType.in_Wait)

