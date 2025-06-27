import { Request, Response } from 'express'
import { Database } from '../Data/data_Base_Conection'

export function closeAttendance(req: Request, res: Response) {
  const db = Database.getDatabase()
  const id_atendimento = Number(req.params.id)

  if (!id_atendimento || isNaN(id_atendimento)) {
    return res.status(400).json({ erro: 'ID de atendimento inválido.' })
  }

  try {
    const stmt = db.prepare(
      "UPDATE ATENDIMENTO SET status_atual = 'finalizado' WHERE id_atendimento = ?",
    )
    const result = stmt.run(id_atendimento)

    if (result.changes === 0) {
      return res.status(404).json({ erro: 'Atendimento não encontrado.' })
    }

    return res.json({
      ok: true,
      mensagem: 'Atendimento finalizado com sucesso.',
    })
  } catch (err: any) {
    return res
      .status(500)
      .json({ erro: 'Erro ao encerrar atendimento', detalhes: err.message })
  }
}
