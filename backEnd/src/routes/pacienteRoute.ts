import express from 'express'
import fs from 'fs'
import path from 'path'
import {
  inserirPaciente,
  buscarPacientesPorCPF,
  buscarPacientePorId,
} from '../Data/import_data'

import { Database } from '../Data/data_Base_Conection'

// IMPORTS PARA A FILA DE TRIAGEM:
import { triageQueue } from '@/queues/triageQueue'
import { Ticket, StatusType } from '@/attending/ticket'
import { Patient } from '@/Patient'
import { RiskRating } from '@/attending/triage'

const router = express.Router()

router.use((req, res, next) => {
  console.log('Entrou no PacienteRoutes:', req.method, req.url)
  next()
})

const dbFile = path.join(process.cwd(), 'JSON/pacientes.json')

interface PacientePayload {
  nome: string
  cpf: string
  data_nascimento?: string
  genero?: string
  endereco?: any
  [key: string]: any
}

type RowAtendimentoPaciente = {
  id_atendimento: number
  id_paciente: number
  horario_entrada: string
  nome: string
  cpf: string
  data_nascimento: string
  genero: string
  rua?: string
  bairro?: string
  cidade?: string
  estado?: string
  cep?: string
  numero?: number | string
  idade?: number | string
}

function salvarPacienteNoJson(novoPaciente: PacientePayload) {
  let pacientes: any[] = []
  if (fs.existsSync(dbFile)) {
    try {
      pacientes = JSON.parse(fs.readFileSync(dbFile, 'utf-8'))
    } catch {
      pacientes = []
    }
  }
  const pacienteComId = {
    ...novoPaciente,
    id: Date.now(),
  }
  pacientes.push(pacienteComId)
  fs.writeFileSync(dbFile, JSON.stringify(pacientes, null, 2), 'utf-8')
  return pacienteComId
}

function normalizarPayloadPaciente(payload: PacientePayload) {
  if (payload.data_Nascimento && !payload.data_nascimento) {
    payload.data_nascimento = payload.data_Nascimento
    delete payload.data_Nascimento
  }
  if (!payload.endereco && payload.address) {
    payload.endereco = payload.address
    delete payload.address
  }
  return payload
}

function calcularIdade(data_nascimento: string): number {
  if (!data_nascimento) return 0
  const nascimento = new Date(data_nascimento)
  const hoje = new Date()
  let idade = hoje.getFullYear() - nascimento.getFullYear()
  const m = hoje.getMonth() - nascimento.getMonth()
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--
  }
  return idade
}

function montarEndereco(row: RowAtendimentoPaciente): string {
  if (!row.rua) return ''
  return `${row.rua}${row.numero ? ', ' + row.numero : ''}${row.bairro ? ' - ' + row.bairro : ''}${row.cidade ? ', ' + row.cidade : ''}${row.estado ? ' - ' + row.estado : ''}${row.cep ? ', CEP: ' + row.cep : ''}`
}

router.get('/ping', (req, res) => {
  res.json({ ok: true })
})

// CADASTRO DE PACIENTE JÁ INICIANDO ATENDIMENTO E TRIAGEM
router.post('/', (req, res) => {
  try {
    let payload: PacientePayload = req.body
    console.log('Payload recebido no cadastro de paciente:', payload)
    payload = normalizarPayloadPaciente(payload)
    const pacienteJson = salvarPacienteNoJson(payload)
    // <- Aqui, insere no banco e PEGA o id gerado
    const id_paciente = inserirPaciente(payload)

    if (!id_paciente) {
      throw new Error('Falha ao inserir paciente no banco de dados.')
    }

    const db = Database.getDatabase()
    const data_hora_entrada = new Date().toISOString()

    // Busca o próximo ticket
    const row = db
      .prepare('SELECT MAX(ticket) as maxTicket FROM atendimento')
      .get() as { maxTicket: number | null }
    const ticket = (row?.maxTicket || 0) + 1

    // Cria atendimento
    const stmt = db.prepare(`
      INSERT INTO atendimento (id_paciente, data_hora_entrada, status_atual, ticket)
      VALUES (?, ?, ?, ?)
    `)
    const result = stmt.run(
      id_paciente,
      data_hora_entrada,
      'aguardando_triagem',
      ticket,
    )
    const id_atendimento = Number(result.lastInsertRowid)

    // Busca paciente + endereço para ticket
    const rowPaciente = db
      .prepare(
        `
      SELECT a.id_atendimento, a.id_paciente, COALESCE(a.data_hora_entrada, ?) as horario_entrada,
        p.nome, p.cpf, p.data_nascimento, p.genero,
        e.rua, e.bairro, e.cidade, e.estado, e.cep, e.numero, p.idade
      FROM atendimento a
      JOIN paciente p ON a.id_paciente = p.id_paciente
      LEFT JOIN endereco_paciente ep ON p.id_paciente = ep.id_paciente
      LEFT JOIN endereco e ON ep.id_endereco = e.id_endereco
      WHERE a.id_atendimento = ?
    `,
      )
      .get(data_hora_entrada, id_atendimento) as
      | RowAtendimentoPaciente
      | undefined

    let dataEntrada: Date
    if (
      rowPaciente?.horario_entrada &&
      !isNaN(new Date(rowPaciente.horario_entrada).getTime())
    ) {
      dataEntrada = new Date(rowPaciente.horario_entrada)
    } else {
      dataEntrada = new Date(data_hora_entrada)
    }

    if (rowPaciente) {
      const enderecoStr = montarEndereco(rowPaciente)
      const idade =
        rowPaciente.idade !== undefined && rowPaciente.idade !== null
          ? String(rowPaciente.idade)
          : String(calcularIdade(rowPaciente.data_nascimento))
      const genero: 'M' | 'F' = rowPaciente.genero === 'M' ? 'M' : 'F'
      const pacienteTicket = new Patient(
        rowPaciente.id_paciente,
        rowPaciente.nome,
        rowPaciente.cpf,
        idade,
        genero,
        enderecoStr,
        dataEntrada,
      )

      const ticketObj = new Ticket(
        pacienteTicket,
        RiskRating.nao_classificado,
        StatusType.waitingTriage,
        dataEntrada,
        rowPaciente.id_atendimento,
      )
      if (typeof triageQueue.addTicket === 'function') {
        triageQueue.addTicket(ticketObj)
        console.log(
          'Paciente',
          rowPaciente.nome,
          'adicionado à fila de triagem.',
        )
      }
    }

    res.status(201).json({
      mensagem: 'Paciente cadastrado e enviado para triagem!',
      id: id_paciente,
      nome: payload.nome,
      jsonId: pacienteJson.id,
      id_atendimento,
      data_hora_entrada,
      ticket,
    })
  } catch (error: any) {
    console.error('Erro ao cadastrar paciente:', error)
    res
      .status(500)
      .json({ erro: 'Erro ao cadastrar paciente', detalhes: error.message })
  }
})

router.get('/cpf/:cpf', (req, res) => {
  const db = Database.getDatabase()
  const { cpf } = req.params
  try {
    const paciente = db.prepare('SELECT * FROM PACIENTE WHERE cpf = ?').get(cpf)
    if (!paciente) {
      return res.status(404).json({ erro: 'Paciente não encontrado.' })
    }
    res.json(paciente)
  } catch (err: any) {
    res
      .status(500)
      .json({ erro: 'Erro ao buscar paciente', detalhes: err.message })
  }
})

router.post('/atendimento', (req, res) => {
  const db = Database.getDatabase()
  const { id_paciente } = req.body
  if (!id_paciente)
    return res.status(400).json({ erro: 'id_paciente obrigatório.' })
  try {
    const data_hora_entrada = new Date().toISOString()

    // Busca o próximo ticket
    const row = db
      .prepare('SELECT MAX(ticket) as maxTicket FROM atendimento')
      .get() as { maxTicket: number | null }
    const ticket = (row?.maxTicket || 0) + 1

    // Faz o INSERT já com ticket
    const stmt = db.prepare(`
      INSERT INTO atendimento (id_paciente, data_hora_entrada, status_atual, ticket)
      VALUES (?, ?, ?, ?)
    `)
    const result = stmt.run(
      id_paciente,
      data_hora_entrada,
      'aguardando_triagem',
      ticket,
    )
    const id_atendimento = Number(result.lastInsertRowid)

    const rowPaciente = db
      .prepare(
        `
      SELECT a.id_atendimento, a.id_paciente, COALESCE(a.data_hora_entrada, ?) as horario_entrada,
        p.nome, p.cpf, p.data_nascimento, p.genero,
        e.rua, e.bairro, e.cidade, e.estado, e.cep, e.numero, p.idade
      FROM atendimento a
      JOIN paciente p ON a.id_paciente = p.id_paciente
      LEFT JOIN endereco_paciente ep ON p.id_paciente = ep.id_paciente
      LEFT JOIN endereco e ON ep.id_endereco = e.id_endereco
      WHERE a.id_atendimento = ?
    `,
      )
      .get(data_hora_entrada, id_atendimento) as
      | RowAtendimentoPaciente
      | undefined

    let dataEntrada: Date
    if (
      rowPaciente?.horario_entrada &&
      !isNaN(new Date(rowPaciente.horario_entrada).getTime())
    ) {
      dataEntrada = new Date(rowPaciente.horario_entrada)
    } else {
      dataEntrada = new Date(data_hora_entrada)
    }

    if (rowPaciente) {
      const enderecoStr = montarEndereco(rowPaciente)
      const idade =
        rowPaciente.idade !== undefined && rowPaciente.idade !== null
          ? String(rowPaciente.idade)
          : String(calcularIdade(rowPaciente.data_nascimento))
      const genero: 'M' | 'F' = rowPaciente.genero === 'M' ? 'M' : 'F'
      const pacienteTicket = new Patient(
        rowPaciente.id_paciente,
        rowPaciente.nome,
        rowPaciente.cpf,
        idade,
        genero,
        enderecoStr,
        dataEntrada,
      )

      const ticketObj = new Ticket(
        pacienteTicket,
        RiskRating.nao_classificado,
        StatusType.waitingTriage,
        dataEntrada,
        rowPaciente.id_atendimento,
      )
      if (typeof triageQueue.addTicket === 'function') {
        triageQueue.addTicket(ticketObj)
      }
    }

    res.status(201).json({
      mensagem: 'Atendimento iniciado com sucesso.',
      id_atendimento,
      data_hora_entrada,
      ticket,
    })
  } catch (err: any) {
    res
      .status(500)
      .json({ erro: 'Erro ao iniciar atendimento', detalhes: err.message })
  }
})

router.get('/', (req, res) => {
  const searchRaw = req.query.search
  const search =
    typeof searchRaw === 'string' ? searchRaw.replace(/\D/g, '') : ''
  if (search && search.length >= 3) {
    try {
      const results = buscarPacientesPorCPF(search)
      return res.json(results)
    } catch (err: any) {
      console.error('Erro ao buscar paciente(s):', err)
      return res
        .status(500)
        .json({ erro: 'Erro ao buscar paciente(s)', detalhes: err.message })
    }
  }
  return res.json([])
})

router.put('/:id_paciente', (req, res) => {
  const db = Database.getDatabase()
  const { id_paciente } = req.params
  const { nome, data_nascimento, genero } = req.body
  try {
    db.prepare(
      `
      UPDATE paciente SET nome = ?, data_nascimento = ?, genero = ?
      WHERE id_paciente = ?
    `,
    ).run(nome, data_nascimento, genero, id_paciente)
    res.json({ mensagem: 'Paciente atualizado com sucesso.' })
  } catch (err: any) {
    res
      .status(500)
      .json({ erro: 'Erro ao atualizar paciente', detalhes: err.message })
  }
})

router.get('/:id_paciente', (req, res) => {
  try {
    const id = Number(req.params.id_paciente)
    let paciente = null

    try {
      paciente = buscarPacientePorId(id)
    } catch (error) {
      console.error('Erro ao buscar paciente no banco:', error)
    }

    if (!paciente && fs.existsSync(dbFile)) {
      try {
        const pacientes: any[] = JSON.parse(fs.readFileSync(dbFile, 'utf-8'))
        paciente = pacientes.find((p) => p.id == id || p.id_paciente == id)
      } catch (error) {
        console.error('Erro ao ler JSON de pacientes:', error)
      }
    }

    if (!paciente) {
      return res.status(404).json({ erro: 'Paciente não encontrado' })
    }
    res.json(paciente)
  } catch (err: any) {
    console.error('Erro inesperado ao buscar paciente:', err)
    res
      .status(500)
      .json({ erro: 'Erro ao buscar paciente', detalhes: err.message })
  }
})

export default router
