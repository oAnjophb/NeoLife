import fs from 'fs'
import path from 'path'
import { Ticket } from './attending/ticket'
import { Triage } from './attending/triage'
import { Doctor } from './employes/doctor'
import { StatusType } from './employes/Employee'
import { receptionist } from './employes/receptionist'
import { Patient } from './Patient'
import { ServiceQueue } from './queues/serviceQueue'

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

const recepcioonista = new receptionist(298, 'Amanda', 11122233345)
recepcioonista.registerPatient(pacientes[0])

const triagens = pacientes.map((paciente) => new Triage(paciente))

const triagemData = [
  { symptom: 'dor moderada', bloodPress: 130, temp: 37.5, saturation: 96 },
  { symptom: 'febre alta', bloodPress: 120, temp: 39.5, saturation: 98 },
  { symptom: 'falta de ar', bloodPress: 145, temp: 37.0, saturation: 93 },
  { symptom: 'corte superficial', bloodPress: 110, temp: 36.9, saturation: 99 },
]

triagens.forEach((triagem, idx) => {
  if (triagemData[idx]) {
    triagem.addSymptom(triagemData[idx].symptom)
    triagem.bloodPress = triagemData[idx].bloodPress
    triagem.temp = triagemData[idx].temp
    triagem.saturation = triagemData[idx].saturation
  }
})

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
    console.log(`Paciente ${ticketChamado.paciente.name} retirado(a) da fila.`)
    fila.listQueue()
  }
} while (ticketChamado)
