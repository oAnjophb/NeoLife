import * as patientRepo from '../repositories/patientRepository'
import { PatientPayload, AttendanceRow } from '../models/types'
import { triageQueue } from '@/queues/triageQueue'
import { Ticket, StatusType } from '@/attending/ticket'
import { Patient } from '@/models/Patient'
import { RiskRating } from '@/attending/triage'
import { Database } from '../Data/data_Base_Conection'

export async function registerPatient(payload: PatientPayload) {
  const existingPatient = patientRepo.findPatientByCPF(payload.cpf)
  if (existingPatient) {
    throw new Error('A patient with this CPF already exists.')
  }

  const id_paciente = patientRepo.insertPatient(payload)
  if (!id_paciente) throw new Error('Failed to insert patient into database.')

  const id_endereco = patientRepo.insertEndereco(payload.endereco)

  patientRepo.linkEnderecoPaciente(id_paciente, id_endereco)

  const db = Database.getDatabase()
  const entry_datetime = new Date().toISOString()
  const row = db
    .prepare('SELECT MAX(ticket) as maxTicket FROM atendimento')
    .get() as { maxTicket: number | null }
  const ticket = (row?.maxTicket || 0) + 1

  const stmt = db.prepare(`
    INSERT INTO atendimento (id_paciente, data_hora_entrada, status_atual, ticket)
    VALUES (?, ?, ?, ?)
  `)
  const result = stmt.run(
    id_paciente,
    entry_datetime,
    'aguardando_triagem',
    ticket,
  )
  const id_attendance = Number(result.lastInsertRowid)

  const attendanceRow = db
    .prepare(
      `
    SELECT a.id_atendimento, a.id_paciente, COALESCE(a.data_hora_entrada, ?) as horario_entrada,
      p.nome, p.cpf, p.data_nascimento, p.genero,
      e.rua, e.bairro, e.cidade, e.estado, e.cep, e.numero
    FROM atendimento a
    JOIN paciente p ON a.id_paciente = p.id_paciente
    LEFT JOIN endereco_paciente ep ON p.id_paciente = ep.id_paciente
    LEFT JOIN endereco e ON ep.id_endereco = e.id_endereco
    WHERE a.id_atendimento = ?
  `,
    )
    .get(entry_datetime, id_attendance) as AttendanceRow | undefined

  let entryDate: Date
  if (
    attendanceRow?.horario_entrada &&
    !isNaN(new Date(attendanceRow.horario_entrada).getTime())
  ) {
    entryDate = new Date(attendanceRow.horario_entrada)
  } else {
    entryDate = new Date(entry_datetime)
  }

  if (attendanceRow) {
    const addressStr = [
      attendanceRow.rua,
      attendanceRow.numero,
      attendanceRow.bairro,
      attendanceRow.cidade,
      attendanceRow.estado,
      attendanceRow.cep,
    ]
      .filter(Boolean)
      .join(', ')
    const gender: 'M' | 'F' = attendanceRow.genero === 'M' ? 'M' : 'F'
    const patientTicket = new Patient(
      attendanceRow.id_paciente,
      attendanceRow.nome,
      attendanceRow.cpf,
      attendanceRow.data_nascimento,
      gender,
      addressStr,
      entryDate,
    )
    const ticketObj = new Ticket(
      patientTicket,
      RiskRating.nao_classificado,
      StatusType.waitingTriage,
      entryDate,
      attendanceRow.id_atendimento,
    )
    if (typeof triageQueue.addTicket === 'function') {
      triageQueue.addTicket(ticketObj)
    }
  }

  return {
    message: 'Patient registered and sent to triage!',
    id: id_paciente,
    nome: payload.nome,
    id_attendance,
    entry_datetime,
    ticket,
  }
}

export function searchPatientsByCPF(cpfPartial: string) {
  const db = Database.getDatabase()
  const results = db
    .prepare('SELECT * FROM PACIENTE WHERE cpf LIKE ?')
    .all(`%${cpfPartial}%`)
  return results
}

export async function startAttendance(id_paciente: number) {
  const db = Database.getDatabase()
  const entry_datetime = new Date().toISOString()

  const jaNaFila = db
    .prepare(
      'SELECT id_atendimento FROM atendimento WHERE id_paciente = ? AND status_atual = ?',
    )
    .get(id_paciente, 'aguardando_triagem') as { id_atendimento?: number }

  if (jaNaFila?.id_atendimento) {
    return {
      error: true,
      message: 'O paciente já está na fila para a triagem.',
      id_attendance: jaNaFila.id_atendimento,
    }
  }

  const row = db
    .prepare('SELECT MAX(ticket) as maxTicket FROM atendimento')
    .get() as { maxTicket: number | null }

  const ticket = (row?.maxTicket || 0) + 1

  const stmt = db.prepare(`
    INSERT INTO atendimento (id_paciente, data_hora_entrada, status_atual, ticket)
    VALUES (?, ?, ?, ?)
  `)
  const result = stmt.run(
    id_paciente,
    entry_datetime,
    'aguardando_triagem',
    ticket,
  )
  const id_attendance = Number(result.lastInsertRowid)

  return {
    error: false,
    message: 'Atendimento iniciado com sucesso.',
    id_attendance,
    entry_datetime,
    ticket,
  }
}

export function updatePatient(
  id_paciente: number,
  data: Partial<PatientPayload>,
) {
  return patientRepo.updatePatient(id_paciente, data)
}

export function getPatientById(id_paciente: number) {
  return patientRepo.findPatientById(id_paciente)
}

export function getPatientByCPF(cpf: string) {
  return patientRepo.findPatientByCPF(cpf)
}
