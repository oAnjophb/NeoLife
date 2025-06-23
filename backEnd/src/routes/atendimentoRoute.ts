import express from 'express'
import { Database } from '../Data/data_Base_Conection'

const router = express.Router()


router.post('/:id/encerrar', (req, res) => {
  const db = Database.getDatabase()
  const id_atendimento = req.params.id
  try {
    const result = db
      .prepare(
        "UPDATE ATENDIMENTO SET status_atual = 'finalizado' WHERE id_atendimento = ?",
      )
      .run(id_atendimento)
    if (result.changes === 0) {
      return res.status(404).json({ erro: 'Atendimento não encontrado.' })
    }
    res.json({ ok: true, mensagem: 'Atendimento finalizado com sucesso.' })
  } catch (err: any) {
    res
      .status(500)
      .json({ erro: 'Erro ao encerrar atendimento', detalhes: err.message })
  }
})

export default router
