import { Ticket } from './attending/ticket'
import { Triage } from './attending/triage'
import { Doctor } from './employes/doctor'
import { StatusType } from './employes/Employee'
import { receptionist } from './employes/receptionist'
import { Patient } from './Patient'
import { ServiceQueue } from './queues/serviceQueue'

const recepcioonista = new receptionist(298, 'Amanda', 11122233345)
recepcioonista.registerPatient(pacientes)
const pacientes = [
  new Patient(
    1,
    'João Silva',
    '123.456.789-00',
    35,
    'M',
    'Rua A',
    new Date(),
  ),
  new Patient(
    2,
    'Maria Souza',
    '987.654.321-00',
    28,
    'F',
    'Rua B',
    new Date(),
  ),
  new Patient(
    3,
    'Pedro Lima',
    '234.567.890-11',
    65,
    'M',
    'Rua C',
    new Date(),
  ),
  new Patient(
    4,
    'Ana Paula',
    '321.654.987-00',
    12,
    'F',
    'Rua D',
    new Date(),
  ),
]

const triagens = [
  new Triage(pacientes[0]),
  new Triage(pacientes[1]),
  new Triage(pacientes[2]),
  new Triage(pacientes[3]),
]

triagens[0].addSymptom('dor moderada')
triagens[0].bloodPress = 130
triagens[0].temp = 37.5
triagens[0].saturation = 96
triagens[1].addSymptom('febre alta')
triagens[1].bloodPress = 120
triagens[1].temp = 39.5
triagens[1].saturation = 98
triagens[2].addSymptom('falta de ar')
triagens[2].bloodPress = 145
triagens[2].temp = 37.0
triagens[2].saturation = 93
triagens[3].addSymptom('corte superficial')
triagens[3].bloodPress = 110
triagens[3].temp = 36.9
triagens[3].saturation = 99

const fila = new ServiceQueue()
for (let i = 0; i < pacientes.length; i++) {
  const ticket = new Ticket(pacientes[i], triagens[i].riskRating(), StatusType.readyForConsult)
  fila.addTicket(ticket)
}

console.log('\nFila para CONSULTA MÉDICA:')
fila.listQueue()

const medico = new Doctor(1, 'Dra. Maria', 987654321, 'CRM1234')

let ticketChamado: Ticket | null
do {
  ticketChamado = fila.callNextTicket()
  if (ticketChamado) {
    medico.updateStatus(ticketChamado, StatusType.inConsult)
    medico.updateStatus(ticketChamado, StatusType.finished)
    console.log(`Paciente ${ticketChamado.paciente.name} foi atendido.`)
    fila.listQueue()
  }
} while (ticketChamado)
