import { Database } from '../Data/data_Base_Conection'
import { ReceptionistPayload } from '../models/types'

export function insertReceptionist(payload: ReceptionistPayload): number {
  const db = Database.getDatabase()
  const stmt = db.prepare(
    `INSERT INTO RECEPCIONISTA(nome, cpf, senha) VALUES (?, ?, ?)`,
  )
  const result = stmt.run(payload.nome, payload.cpf, payload.senha)
  return Number(result.lastInsertRowid)
}

export function findReceptionistById(id: number) {
  const db = Database.getDatabase()
  return db
    .prepare('SELECT * FROM RECEPCIONISTA WHERE id_recepcionista = ?')
    .get(id)
}

export function listAllReceptionists() {
  const db = Database.getDatabase()
  return db.prepare('SELECT * FROM RECEPCIONISTA').all()
}

export function deleteAllReceptionists() {
  Database.queryNone('DELETE FROM RECEPCIONISTA')
}
