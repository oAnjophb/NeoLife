import { RiskRating } from '@/attending/triage'

export function normalizeRiskRating(value: any): RiskRating {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    switch (value.toLowerCase()) {
      case 'vermelho': return RiskRating.vermelho
      case 'laranja': return RiskRating.laranja
      case 'amarelo': return RiskRating.amarelo
      case 'verde': return RiskRating.verde
      case 'azul': return RiskRating.azul
      default: {
        const asNumber = Number(value)
        if (!isNaN(asNumber)) return asNumber as RiskRating
        return RiskRating.nao_classificado
      }
    }
  }
  return RiskRating.nao_classificado
}