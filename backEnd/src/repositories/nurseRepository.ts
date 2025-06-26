import { Database } from '../Data/data_Base_Conection'
import { NursePayload } from '../models/types'

export function insertNurse(payload: NursePayload): number {
  const db = Database.getDatabase()
  const stmt = db.prepare(
    `INSERT INTO ENFERMEIRO(nome, cpf, coren, senha) VALUES (?, ?, ?, ?)`,
  )
  const result = stmt.run(
    payload.nome,
    payload.cpf,
    payload.coren,
    payload.senha,
  )
  return Number(result.lastInsertRowid)
}

export function findNurseById(id: number) {
  const db = Database.getDatabase()
  return db.prepare('SELECT * FROM ENFERMEIRO WHERE id_enfermeiro = ?').get(id)
}

export function listAllNurses() {
  const db = Database.getDatabase()
  return db.prepare('SELECT * FROM ENFERMEIRO').all()
}

export function deleteAllNurses() {
  Database.queryNone('DELETE FROM ENFERMEIRO')
}
