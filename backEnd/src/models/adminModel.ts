import { Database } from '../Data/data_Base_Conection'

export type Admin = {
  id?: number
  usuario: string
  senha: string
}

export function getAdminByUsuario(usuario: string): Admin | undefined {
  const db = Database.getDatabase()
  const stmt = db.prepare('SELECT * FROM ADMIN WHERE usuario = ?')
  return stmt.get(usuario) as Admin | undefined
}

export function insertAdmin({ usuario, senha }: { usuario: string, senha: string }): number {
  const db = Database.getDatabase()
  const stmt = db.prepare('INSERT INTO ADMIN(usuario, senha) VALUES (?, ?)')
  const result = stmt.run(usuario, senha)
  return Number(result.lastInsertRowid)
}
