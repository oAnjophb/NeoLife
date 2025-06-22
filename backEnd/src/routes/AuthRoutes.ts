import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()
const JWT_SECRET = 'seuSegredoUltraSecreto'

router.post('/', (req, res) => {
  const { tipo, id, senha } = req.body
  const db = req.app.get('db')
  let user = null

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
})

export default router
