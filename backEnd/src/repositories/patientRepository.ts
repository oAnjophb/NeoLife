import { Database } from '../Data/data_Base_Conection'
import { PatientPayload, EnderecoPayload } from '../models/types'

export function insertPatient(payload: PatientPayload): number {
  const db = Database.getDatabase()
  const stmt = db.prepare(`
    INSERT INTO PACIENTE (nome, cpf, data_nascimento, genero)
    VALUES (?, ?, ?, ?)
  `)
  const result = stmt.run(
    payload.nome,
    payload.cpf,
    payload.data_nascimento,
    payload.genero,
  )
  return Number(result.lastInsertRowid)
}

export function insertEndereco(endereco: EnderecoPayload): number {
  const db = Database.getDatabase()
  const stmt = db.prepare(`
    INSERT INTO ENDERECO (rua, bairro, cidade, estado, cep, numero)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  const result = stmt.run(
    endereco.rua,
    endereco.bairro,
    endereco.cidade,
    endereco.estado,
    endereco.cep,
    endereco.numero,
  )
  return Number(result.lastInsertRowid)
}

export function linkEnderecoPaciente(id_paciente: number, id_endereco: number) {
  const db = Database.getDatabase()
  db.prepare(
    `
    INSERT INTO ENDERECO_PACIENTE (id_paciente, id_endereco)
    VALUES (?, ?)
  `,
  ).run(id_paciente, id_endereco)
}

export function findPatientByCPF(cpf: string) {
  const db = Database.getDatabase()
  return db.prepare('SELECT * FROM PACIENTE WHERE cpf = ?').get(cpf)
}

export function findPatientById(id: number) {
  const db = Database.getDatabase()
  return db.prepare('SELECT * FROM PACIENTE WHERE id_paciente = ?').get(id)
}

export function updatePatient(id: number, data: Partial<PatientPayload>) {
  const db = Database.getDatabase()

  return db
    .prepare(
      `UPDATE PACIENTE SET nome = ?, data_nascimento = ?, genero = ? WHERE id_paciente = ?`,
    )
    .run(data.nome, data.data_nascimento, data.genero, id)
}

export function listAllPatients() {
  const db = Database.getDatabase()
  return db.prepare('SELECT * FROM PACIENTE').all()
}
