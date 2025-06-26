import { Request, Response } from 'express'
import { Database } from '../Data/data_Base_Conection'
import fs from 'fs'
import path from 'path'

import { serviceQueue } from '@/queues/serviceQueue'
import { Ticket } from '@/attending/ticket'
import { RiskRating } from '@/attending/triage'
import { StatusType } from '@/attending/ticket'
import { Patient } from '@/models/Patient'
import { Triagem } from '@/models/triageModel'
import { normalizeRiskRating } from '@/utils/normalizeRiskRating'

const dbFile = path.join(process.cwd(), 'JSON/triagens.json')

function salvarTriagemNoJson(novaTriagem: any) {
  let triagens: any[] = []
  if (fs.existsSync(dbFile)) {
    try {
      triagens = JSON.parse(fs.readFileSync(dbFile, 'utf-8'))
    } catch {
      triagens = []
    }
  }
  const triagemComId = {
    ...novaTriagem,
    id_triagem: Date.now(),
  }
  triagens.push(triagemComId)
  fs.writeFileSync(dbFile, JSON.stringify(triagens, null, 2), 'utf-8')
  return triagemComId
}

export function getTriagemByAtendimento(req: Request, res: Response) {
  const db = Database.getDatabase()
  const id_atendimento = req.params.id_atendimento
  try {
    const triagem = db
      .prepare(
        `SELECT t.*, p.nome AS nome_paciente, p.data_nascimento, p.genero
         FROM triagem t
         JOIN paciente p ON t.id_paciente = p.id_paciente
         WHERE t.id_atendimento = ?
         ORDER BY t.data_triagem DESC LIMIT 1`,
      )
      .get(id_atendimento) as Triagem | undefined

    if (!triagem) {
      return res
        .status(404)
        .json({ erro: 'Triagem não encontrada para esse atendimento.' })
    }

    triagem.id_classificacao_risco = normalizeRiskRating(
      triagem.id_classificacao_risco,
    )

    res.json(triagem)
  } catch (err: any) {
    res.status(500).json({
      erro: 'Erro ao buscar triagem por atendimento',
      detalhes: err.message,
    })
  }
}

export function getTriagensByPaciente(req: Request, res: Response) {
  const db = Database.getDatabase()
  const id_paciente = req.params.id_paciente
  try {
    const triagens = db
      .prepare(
        'SELECT * FROM triagem WHERE id_paciente = ? ORDER BY data_triagem DESC',
      )
      .all(id_paciente) as Triagem[]

    triagens.forEach((t) => {
      t.id_classificacao_risco = normalizeRiskRating(t.id_classificacao_risco)
    })

    res.json(triagens)
  } catch (err: any) {
    res.status(500).json({
      erro: 'Erro ao buscar triagens do paciente',
      detalhes: err.message,
    })
  }
}

export function iniciarTriagem(req: Request, res: Response) {
  const { id_atendimento } = req.body
  if (!id_atendimento) {
    return res.status(400).json({ erro: 'id_atendimento obrigatório' })
  }
  const db = Database.getDatabase()
  const atendimento = db
    .prepare('SELECT * FROM ATENDIMENTO WHERE id_atendimento = ?')
    .get(id_atendimento)
  if (!atendimento) {
    return res.status(404).json({ erro: 'Atendimento não encontrado' })
  }
  db.prepare(
    'UPDATE ATENDIMENTO SET status_atual = ? WHERE id_atendimento = ?',
  ).run('em_triagem', id_atendimento)
  res.json({ ok: true })
}

export function cadastrarTriagem(req: Request, res: Response) {
  const db = Database.getDatabase()
  const {
    id_paciente,
    id_atendimento,
    data_triagem,
    id_classificacao_risco,
    sintomas,
    temperatura,
    saturacao,
    pressao_sanguinea,
  } = req.body

  const id_enfermeiro = req.user?.tipo === 'enfermeiro' ? req.user.id : null

  if (!id_enfermeiro) {
    return res.status(401).json({
      erro: 'Somente enfermeiros autenticados podem registrar triagem.',
    })
  }
  if (
    !id_paciente ||
    !id_atendimento ||
    !data_triagem ||
    !id_classificacao_risco
  ) {
    return res.status(400).json({ erro: 'Campos obrigatórios faltando.' })
  }

  const dataTriagemJS = new Date(data_triagem)
  if (isNaN(dataTriagemJS.getTime())) {
    return res.status(400).json({ erro: 'data_triagem inválida.' })
  }

  const id_classificacao_risco_norm = normalizeRiskRating(
    id_classificacao_risco,
  )

  try {
    const stmt = db.prepare(`
      INSERT INTO triagem (
        id_paciente, id_atendimento, data_triagem, id_classificacao_risco,
        sintomas, temperatura, saturacao, pressao_sanguinea
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const result = stmt.run(
      id_paciente,
      id_atendimento,
      data_triagem,
      id_classificacao_risco_norm,
      sintomas,
      temperatura,
      saturacao,
      pressao_sanguinea,
    )
    const id_triagem = result.lastInsertRowid

    db.prepare(
      `INSERT INTO TRIAGEM_ENFERMEIRO (id_triagem, id_enfermeiro) VALUES (?, ?)`,
    ).run(id_triagem, id_enfermeiro)

    const triagemJson = salvarTriagemNoJson({
      ...req.body,
      id_enfermeiro,
      id_triagem,
      id_classificacao_risco: id_classificacao_risco_norm,
    })

    db.prepare(
      `
      UPDATE ATENDIMENTO SET status_atual = 'aguardando_consulta'
      WHERE id_atendimento = ?
    `,
    ).run(id_atendimento)

    const pacienteRow = db
      .prepare('SELECT * FROM PACIENTE WHERE id_paciente = ?')
      .get(id_paciente)
    const atendimentoRow = db
      .prepare('SELECT * FROM ATENDIMENTO WHERE id_atendimento = ?')
      .get(id_atendimento)

    if (!pacienteRow || !atendimentoRow) {
      return res
        .status(404)
        .json({ erro: 'Paciente ou atendimento não encontrado.' })
    }

    const paciente: Patient = Patient.fromRow(pacienteRow)

    const prioridade: RiskRating = id_classificacao_risco_norm
    const status: StatusType = StatusType.readyForConsult

    const ticket = new Ticket(
      paciente,
      prioridade,
      status,
      dataTriagemJS,
      id_atendimento,
    )
    serviceQueue.addTicket(ticket)
    console.log('Fila de consulta após add:', serviceQueue.getOrderedQueue())

    res.status(201).json({
      mensagem: 'Triagem cadastrada!',
      id_triagem,
      jsonId: triagemJson.id_triagem,
    })
  } catch (error: any) {
    res
      .status(500)
      .json({ erro: 'Erro ao cadastrar triagem', detalhes: error.message })
  }
}

export function listarTriagens(req: Request, res: Response) {
  const db = Database.getDatabase()
  const id_paciente = req.query.id_paciente
  try {
    let triagens: Triagem[]
    if (id_paciente) {
      triagens = db
        .prepare(
          'SELECT * FROM triagem WHERE id_paciente = ? ORDER BY data_triagem DESC',
        )
        .all(id_paciente) as Triagem[]
    } else {
      triagens = db
        .prepare('SELECT * FROM triagem ORDER BY data_triagem DESC')
        .all() as Triagem[]
    }

    triagens.forEach((t) => {
      t.id_classificacao_risco = normalizeRiskRating(t.id_classificacao_risco)
    })

    res.json(triagens)
  } catch (err: any) {
    res
      .status(500)
      .json({ erro: 'Erro ao buscar triagens', detalhes: err.message })
  }
}
