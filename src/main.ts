import { Ticket } from './attending/ticket'
import { Triage } from './attending/triage'
import { Doctor } from './employes/doctor'
import { Positions, StatusType } from './employes/Employee'
import { Patient } from './Patient'
import { ServiceQueue } from './queues/serviceQueue'

const paciente1 = new Patient(
  1,
  'João Silva',
  '123.456.789-00',
  35,
  'M',
  'Rua A',
  new Date(),
  StatusType.waitingTriage,
)

const triagem = new Triage(paciente1)
triagem.addSymptom('dor moderada')
triagem.bloodPress = 130
triagem.temp = 37.5
triagem.saturation = 96
const prioridade = triagem.riskRating()

const ticket = new Ticket(paciente1, prioridade)
const fila = new ServiceQueue()
fila.addTicket(ticket)

fila.listQueue()

const medico = new Doctor(
  1,
  'Dra. Maria',
  987654321,
  'CRM1234',
  Positions.Doctor,
)
const ticketChamado = fila.callNextTicket()
if (ticketChamado) {
  medico.updateStatus(ticketChamado.paciente, StatusType.inConsult)

  medico.updateStatus(ticketChamado.paciente, StatusType.finished)
}

fila.listQueue()
