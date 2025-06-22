import express from 'express'
import { serviceQueue } from '@/queues/serviceQueue'
import { RiskRating } from '@/attending/triage'
import { Ticket } from '@/attending/ticket'

const router = express.Router()

router.get('/', (req, res) => {
  const fila = serviceQueue.getOrderedQueue().map((ticket: Ticket) => ({
    id: ticket.paciente.id_paciente,
    paciente: ticket.paciente.nome,
    prioridade: RiskRating[ticket.prioridade].toLowerCase(),
    horaTriagem: new Date(ticket.data_triagem).toLocaleTimeString([], {
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
    id: ticket.paciente.id_paciente,  
    paciente: ticket.paciente.nome,   
    prioridade: RiskRating[ticket.prioridade].toLowerCase(),
    horaTriagem: new Date(ticket.data_triagem).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  })
})

export default router