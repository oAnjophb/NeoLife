import { Ticket, StatusType } from '@/attending/ticket'
import { Patient } from '@/models/Patient'
import { RiskRating } from '@/attending/triage'
import { Triagem } from '@/models/triageModel'
import { Database } from '../Data/data_Base_Conection'

const db = Database.getDatabase()

interface AtendimentoRow {
  id_atendimento: number
  status_atual: string
  data_hora_entrada: string
}

function mapStatus(status: string): StatusType {
  const statusMap: Record<string, StatusType> = {
    'aguardando_triagem': StatusType.waitingTriage,
    'aguardando_consulta': StatusType.readyForConsult,  
    'pronto_para_consulta': StatusType.readyForConsult,
    'em_triagem': StatusType.inTriage,
    'em_atendimento': StatusType.inConsult,
    'finalizado': StatusType.finished,
    'cancelado': StatusType.cancel,
  }
  return statusMap[status] || StatusType.waitingTriage
}

export function getTicketFromPacienteId(id_paciente: number): Ticket | null {
  const atendimento = db.prepare(`
    SELECT 
      a.id_atendimento,
      a.status_atual,
      a.data_hora_entrada
    FROM atendimento a
    WHERE a.id_paciente = ?
    ORDER BY a.data_hora_entrada DESC
    LIMIT 1
  `).get(id_paciente) as AtendimentoRow | undefined

  if (!atendimento){
    console.log(`Nenhum atendimento encontrado para paciente ${id_paciente}`)
    return null
  } 

  const paciente = db.prepare(`
    SELECT 
      id_paciente,
      nome,
      cpf,
      data_nascimento,
      genero
    FROM paciente
    WHERE id_paciente = ?
  `).get(id_paciente) as Patient | undefined

  if (!paciente) return null

  const triagem = db.prepare(`
    SELECT 
      t.id_triagem,
      t.id_classificacao_risco,
      t.sintomas,
      t.temperatura,
      t.saturacao,
      t.pressao_sanguinea,
      t.data_triagem,
      t.id_paciente,
      t.id_atendimento
    FROM triagem t
    WHERE t.id_atendimento = ?
    ORDER BY t.data_triagem DESC
    LIMIT 1
  `).get(atendimento.id_atendimento) as Triagem | undefined

  if (!triagem) return null

  const status = mapStatus(atendimento.status_atual)

  return new Ticket(
    paciente,
    triagem.id_classificacao_risco as RiskRating,
    status,
    new Date(triagem.data_triagem),
    atendimento.id_atendimento
  )
}