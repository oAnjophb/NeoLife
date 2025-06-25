import { Request, Response } from 'express'
import { serviceQueue } from '@/queues/serviceQueue'
import { RiskRating } from '@/attending/triage'
import { Ticket } from '@/attending/ticket'


export function getQueue(_req: Request, res: Response) {
  const queue = serviceQueue.getOrderedQueue().map((ticket: Ticket) => ({
    id: ticket.paciente.id_paciente,
    paciente: ticket.paciente.nome,
    prioridade: RiskRating[ticket.prioridade].toLowerCase(),
    horaTriagem: new Date(ticket.dataTriagem).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }))
  console.log('Fila atual:', queue)
  res.json(queue)
}


export function callNext(_req: Request, res: Response) {
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
}