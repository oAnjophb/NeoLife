export interface EnderecoPayload {
  rua: string
  numero: number
  bairro: string
  cidade: string
  estado: string
  cep: string
}

export interface PatientPayload {
  nome: string
  cpf: string
  data_nascimento?: string
  genero?: string
  endereco: EnderecoPayload
}

export type AttendanceRow = {
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
}