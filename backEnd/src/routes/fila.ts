import express from 'express'
import { serviceQueue } from '@/queues/serviceQueue'
import { RiskRating } from '@/attending/triage'
import { Ticket } from '@/attending/ticket'
import path from 'path'
import { Database } from '../Data/data_Base_Conection' // Ajuste o caminho conforme sua estrutura

const router = express.Router()

router.get('/', (req, res) => {
  const fila = serviceQueue.getOrderedQueue().map((ticket: Ticket) => ({
    id: ticket.paciente.id_paciente,
    paciente: ticket.paciente.nome,
    prioridade: RiskRating[ticket.prioridade].toLowerCase(),
    horaTriagem: new Date(ticket.dataTriagem).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }))
  console.log('Fila atual:', fila)
  res.json(fila)
})

router.post('/chamar', (req, res) => {
  const ticket = serviceQueue.callNextTicket()
  if (!ticket) return res.status(404).json({ erro: 'Fila vazia' })
  res.json({
    id_atendimento: ticket.id_atendimento,
    paciente: ticket.paciente.nome,
    prioridade: RiskRating[ticket.prioridade].toLowerCase(),
    horaTriagem: new Date(ticket.dataTriagem).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  })
})

export default router
