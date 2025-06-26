import { Database } from '../Data/data_Base_Conection'
import { Ticket } from '../attending/ticket'

const db = Database.getDatabase()

export function getTicketFromPacienteId(id_paciente: number): Ticket | null {
  // Busque os dados que precisa para montar o Ticket
  const row = db.prepare(`
    SELECT 
      t.id_ticket,
      t.id_atendimento,
      t.prioridade,
      t.dataTriagem,
      t.status,
      p.id_paciente,
      p.nome as nome_paciente
    FROM TICKETS t
    JOIN PACIENTES p ON t.id_paciente = p.id_paciente
    WHERE t.id_paciente = ?
    ORDER BY t.dataTriagem DESC
    LIMIT 1
  `).get(id_paciente)

  if (!row) return null

  // Monte o objeto Ticket conforme seu modelo
  const ticket: Ticket = {
    id_ticket: row.id_ticket,
    id_atendimento: row.id_atendimento,
    prioridade: row.prioridade,
    dataTriagem: row.dataTriagem,
    status: row.status,
    paciente: {
      id_paciente: row.id_paciente,
      nome: row.nome_paciente
      // inclua outros campos do paciente se precisar
    },
    // outros campos do Ticket se houver
  }
  return ticket
}