import fs from 'fs'
import path from 'path'
import { Ticket } from './attending/ticket'
import { Triage } from './attending/triage'
import { Doctor } from './employes/doctor'
import { StatusType } from './employes/Employee'
import { receptionist } from './employes/receptionist'
import { Patient } from './Patient'
import { ServiceQueue } from './queues/serviceQueue'

// Carregando pacientes do JSON
const pacientesRaw = fs.readFileSync(
  path.join(__dirname, 'patients.json'),
  'utf-8',
)
const pacientesJson = JSON.parse(pacientesRaw)
const pacientes: Patient[] = pacientesJson.map(
  (p: any) =>
    new Patient(
      p.id,
      p.name,
      p.cpf,
      p.age,
      p.gender,
      p.address,
      new Date(p.entryTime),
    ),
)

// Instancie o recepcionista e registre os pacientes (se necessário)
const recepcioonista = new receptionist(298, 'Amanda', 11122233345)
recepcioonista.registerPatient(pacientes[0]) // Exemplo, pode adaptar para todos

// Continue normalmente com as triagens
const triagens = pacientes.map((paciente) => new Triage(paciente))

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
  const ticket = new Ticket(
    pacientes[i],
    triagens[i].riskRating(),
    StatusType.readyForConsult,
  )
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
