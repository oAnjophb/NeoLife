import { Request, Response } from 'express'
import { Database } from '../Data/data_Base_Conection'

export function TriageForRiskToday(req: Request, res: Response) {
  try {
    const rows = Database.queryMany<{
      nome_classificacao: string
      total: number
    }>(
      `SELECT cr.nome_classificacao, COUNT(*) as total
       FROM TRIAGEM t
       JOIN CLASSIFICACAO_RISCOS cr ON t.id_classificacao_risco = cr.id_classificacao_risco
       WHERE DATE(t.data_triagem) = DATE('now')
       GROUP BY cr.nome_classificacao`,
    )
    const result: Record<string, number> = {}
    rows.forEach((r) => (result[r.nome_classificacao] = r.total))
    res.json(result)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}

export function allTriageForDay(req: Request, res: Response) {
  try {
    const rows = Database.queryMany<{ data: string; total: number }>(
      `SELECT DATE(t.data_triagem) as data, COUNT(*) as total
       FROM TRIAGEM t
       WHERE t.data_triagem >= DATE('now', '-6 days')
       GROUP BY DATE(t.data_triagem)
       ORDER BY data`,
    )
    res.json(rows)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}

export function nextService(req: Request, res: Response) {
  try {
    const rows = Database.queryMany<{
      id_consulta: number
      nome_paciente: string
      data_consulta_marcada: string
    }>(
      `SELECT c.id_consulta, p.nome as nome_paciente, c.data_consulta_marcada
       FROM MARCA_CONSULTA c
       JOIN PACIENTE p ON c.id_paciente = p.id_paciente
       WHERE c.data_consulta_marcada >= DATETIME('now')
       ORDER BY c.data_consulta_marcada ASC
       LIMIT 5`,
    )
    const result = rows.map((r) => ({
      id: r.id_consulta,
      nome_paciente: r.nome_paciente,
      data_hora: r.data_consulta_marcada,
    }))
    res.json(result)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}

export function criticalPatients(req: Request, res: Response) {
  try {
    const rows = Database.queryMany<{
      id_paciente: number
      nome: string
      nome_classificacao: string
    }>(
      `SELECT p.id_paciente, p.nome, cr.nome_classificacao
       FROM FILA_PRIORIDADE f
       JOIN PACIENTE p ON f.id_paciente = p.id_paciente
       JOIN TRIAGEM t ON t.id_paciente = p.id_paciente
       JOIN CLASSIFICACAO_RISCOS cr ON t.id_classificacao_risco = cr.id_classificacao_risco
       WHERE cr.nome_classificacao = 'Vermelho'
       ORDER BY t.data_triagem DESC`,
    )
    const result = rows.map((r) => ({
      id: r.id_paciente,
      nome: r.nome,
      classificacao: r.nome_classificacao,
    }))
    res.json(result)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}
