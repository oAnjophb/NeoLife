import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { Database } from '../Data/data_Base_Conection'

const JWT_SECRET = 'seuSegredoUltraSecreto'

export function authenticateUser(req: Request, res: Response) {
  const { tipo, id, senha } = req.body
  if (!tipo || !id || !senha) {
    return res.status(400).json({ erro: 'Tipo, id e senha são obrigatórios' })
  }

  const db = Database.getDatabase()
  let user: any = null

  if (tipo === 'medico') {
    user = db
      .prepare(
        'SELECT id_medico as id, nome, cpf, crm FROM MEDICO WHERE id_medico = ? AND senha = ?',
      )
      .get(id, senha)
  } else if (tipo === 'enfermeiro') {
    user = db
      .prepare(
        'SELECT id_enfermeiro as id, nome, cpf, coren FROM ENFERMEIRO WHERE id_enfermeiro = ? AND senha = ?',
      )
      .get(id, senha)
  } else if (tipo === 'recepcionista') {
    user = db
      .prepare(
        'SELECT id_recepcionista as id, nome, cpf FROM RECEPCIONISTA WHERE id_recepcionista = ? AND senha = ?',
      )
      .get(id, senha)
  } else {
    return res.status(400).json({ erro: 'Tipo inválido' })
  }

  if (!user) {
    return res.status(401).json({ erro: 'ID ou senha inválidos' })
  }

  user.tipo = tipo

  const token = jwt.sign(
    {
      id: user.id,
      tipo: user.tipo,
    },
    JWT_SECRET,
    { expiresIn: '8h' },
  )

  return res.json({ ...user, token })
}
