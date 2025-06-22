import express from 'express'
import { insertPatient } from '../Data/import_data'

const router = express.Router()


router.post('/', (req, res) => {
  try {
    const db = req.app.get('db')
    const payload = req.body
    console.log('Payload recebido:', JSON.stringify(payload, null, 2));
    const id = insertPatient(db, payload) // <- agora retorna o id!
    res.status(201).json({ mensagem: 'Paciente cadastrado!', id }) // <- responde com id
  } catch (error: any) {
    res.status(500).json({ erro: 'Erro ao cadastrar paciente', detalhes: error.message })
  }
})

export default router