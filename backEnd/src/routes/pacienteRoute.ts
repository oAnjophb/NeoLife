import express from 'express'
import fs from 'fs'
import path from 'path'
import {
  inserirPaciente,
  buscarPacientesPorCPF,
  buscarPacientePorId,
} from '../Data/import_data'

const router = express.Router()

router.use((req, res, next) => {
  console.log("Entrou no PacienteRoutes:", req.method, req.url)
  next()
})

const dbFile = path.join(process.cwd(), 'JSON/pacientes.json')

function salvarPacienteNoJson(novoPaciente: any) {
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
    id: Date.now()
  }
  pacientes.push(pacienteComId)
  fs.writeFileSync(dbFile, JSON.stringify(pacientes, null, 2), 'utf-8')
  return pacienteComId
}

function normalizarPayloadPaciente(payload: any) {
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

router.get('/ping', (req, res) => {
  res.json({ ok: true })
})

router.post('/', (req, res) => {
  try {
    const db = req.app.get('db')
    let payload = req.body
    console.log('Payload recebido no cadastro de paciente:', payload)
    payload = normalizarPayloadPaciente(payload)
    const pacienteJson = salvarPacienteNoJson(payload)
    const id_paciente = inserirPaciente(db, payload)
    res.status(201).json({ mensagem: 'Paciente cadastrado!', id_paciente, jsonId: pacienteJson.id })
  } catch (error: any) {
    console.error('Erro ao cadastrar paciente:', error)
    res.status(500).json({ erro: 'Erro ao cadastrar paciente', detalhes: error.message })
  }
})


router.get('/', (req, res) => {
  const db = req.app.get('db')
  const search = (req.query.search as string)?.replace(/\D/g, '')
  if (search && search.length >= 3) {
    try {
      const results = buscarPacientesPorCPF(db, search)
      return res.json(results)
    } catch (err: any) {
      console.error('Erro ao buscar paciente(s):', err)
      return res.status(500).json({ erro: 'Erro ao buscar paciente(s)', detalhes: err.message })
    }
  }
  return res.json([])
})


router.get('/:id_paciente', (req, res) => {
  const db = req.app.get('db')
  try {
    const id = Number(req.params.id_paciente)
    let paciente = null


    try {
      paciente = buscarPacientePorId(db, id)
    } catch (error) {
      console.error('Erro ao buscar paciente no banco:', error)
    }


    if (!paciente && fs.existsSync(dbFile)) {
      try {
        const pacientes: any[] = JSON.parse(fs.readFileSync(dbFile, 'utf-8'))
        paciente = pacientes.find(p => p.id == id || p.id_paciente == id)
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
    res.status(500).json({ erro: 'Erro ao buscar paciente', detalhes: err.message })
  }
})

export default router