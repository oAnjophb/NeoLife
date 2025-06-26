import { Request, Response } from 'express'
import { serviceQueue } from '@/services/serviceQueue'
import { RiskRating } from '@/attending/triage'
import { Ticket } from '@/attending/ticket'

export function getQueue(_req: Request, res: Response) {
  const queue = serviceQueue.getOrderedQueue().map((ticket: Ticket) => ({
    id_atendimento: ticket.id_atendimento, // se existir
    id_paciente: ticket.paciente.id_paciente,
    paciente: ticket.paciente.nome,
    prioridade: ticket.prioridade,
    prioridadeNome: RiskRating[ticket.prioridade],
    horaTriagem: new Date(ticket.dataTriagem).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    dataTriagem: ticket.dataTriagem, // formato ISO
  }))
  console.log('Fila atual:', queue)
  res.json(queue)
}

export function callNext(_req: Request, res: Response) {
  const ticket = serviceQueue.callNextTicket()
  if (!ticket) return res.status(404).json({ erro: 'Fila vazia' })
  res.json({
    id_atendimento: ticket.id_atendimento, // se existir
    id_paciente: ticket.paciente.id_paciente,
    paciente: ticket.paciente.nome,
    prioridade: ticket.prioridade,
    prioridadeNome: RiskRating[ticket.prioridade],
    horaTriagem: new Date(ticket.dataTriagem).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    dataTriagem: ticket.dataTriagem,
  })
}

export function getQueuPriority(req: Request, res: Response) {
  res.json(serviceQueue.getOrderedQueue())
}