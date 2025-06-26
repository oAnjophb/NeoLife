import { RiskRating } from '@/attending/triage'

export interface Triagem {
  id_triagem: number
  id_classificacao_risco: RiskRating | number
  sintomas: string
  temperatura?: number | null
  saturacao?: number | null
  pressao_sanguinea?: number | null
  data_triagem: string
  id_paciente: number
  id_atendimento?: number | null

  nome_paciente?: string
  data_nascimento?: string
  genero?: string
}
