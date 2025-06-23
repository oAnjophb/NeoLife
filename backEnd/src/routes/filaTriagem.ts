import express from 'express'
import { StatusType } from '@/attending/ticket'
import { Database } from '../Data/data_Base_Conection'

const router = express.Router()

interface RowAtendimento {
  id_atendimento: number
  id_paciente: number
  data_hora_entrada: string
  nome_paciente: string
  cpf: string
}

router.get('/', (req, res) => {
  const db = Database.getDatabase()
  const rows = db
    .prepare(
      `
    SELECT 
      a.id_atendimento, a.id_paciente, a.data_hora_entrada,
      p.nome as nome_paciente, p.cpf
    FROM atendimento a
    JOIN paciente p ON a.id_paciente = p.id_paciente
    WHERE a.status_atual IN ('aguardando_triagem', 'em_triagem')
    ORDER BY a.ticket ASC, a.data_hora_entrada ASC
  `,
    )
    .all() as RowAtendimento[]
  res.json(rows)
})

// Chamar próximo da triagem (opcional)
router.post('/chamar', (req, res) => {
  const db = Database.getDatabase()
  const row = db
    .prepare(
      `
    SELECT 
      a.id_atendimento, a.id_paciente, a.data_hora_entrada,
      p.nome as nome_paciente, p.cpf
    FROM atendimento a
    JOIN paciente p ON a.id_paciente = p.id_paciente
    WHERE a.status_atual = 'aguardando_triagem'
    ORDER BY a.ticket ASC, a.data_hora_entrada ASC
    LIMIT 1
  `,
    )
    .get() as RowAtendimento | undefined

  if (!row) {
    return res.status(404).json({ erro: 'Fila de triagem vazia' })
  }

  db.prepare(
    `
    UPDATE atendimento SET status_atual = 'em_triagem'
    WHERE id_atendimento = ?
  `,
  ).run(row.id_atendimento)

  res.json({
    id_atendimento: row.id_atendimento,
    nome_paciente: row.nome_paciente,
    cpf: row.cpf,
    data_hora_entrada: row.data_hora_entrada,
    status: StatusType.inTriage,
  })
})

export default router
