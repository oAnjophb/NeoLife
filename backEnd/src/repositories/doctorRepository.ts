import { Database } from '../Data/data_Base_Conection'
import { DoctorPayload } from '../models/types'

export function insertDoctor(payload: DoctorPayload): number {
  const db = Database.getDatabase()
  const stmt = db.prepare(
    `INSERT INTO MEDICO(nome, cpf, crm, senha) VALUES (?, ?, ?, ?)`,
  )
  const result = stmt.run(payload.nome, payload.cpf, payload.crm, payload.senha)
  return Number(result.lastInsertRowid)
}

export function findDoctorById(id: number) {
  const db = Database.getDatabase()
  return db.prepare('SELECT * FROM MEDICO WHERE id_medico = ?').get(id)
}

export function listAllDoctors() {
  const db = Database.getDatabase()
  return db.prepare('SELECT * FROM MEDICO').all()
}

export function deleteAllDoctors() {
  Database.queryNone('DELETE FROM MEDICO')
}
