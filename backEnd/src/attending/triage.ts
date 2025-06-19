
import { Patient } from '@/Patient'

export enum RiskRating {
  azul = 4,
  verde = 3,
  amarelo = 2,
  laranja = 1,
  vermelho = 0,
}

export class Triage {
  public symptoms: string[] = []
  public bloodPress: number = 0
  public temp: number = 0
  public saturation: number = 0

  constructor(public patient: Patient) {}

  addSymptom(symptom: string): void {
    this.symptoms.push(symptom)
  }

  recordVitals(): string[] {
    return [
      `Pressão arterial: ${this.bloodPress} mmHg`,
      `Temperatura: ${this.temp} °C`,
      `Saturação: ${this.saturation}%`,
    ]
  }

  riskRating(): RiskRating {
    switch (true) {
      case this.saturation < 90:
      case this.temp >= 40:
      case this.bloodPress >= 180:
        return RiskRating.vermelho

      case this.saturation < 94:
      case this.temp >= 38.5:
        return RiskRating.laranja

      case this.symptoms.includes('dor moderada'):
        return RiskRating.amarelo

      case this.symptoms.includes('dor leve'):
        return RiskRating.verde

      default:
        return RiskRating.azul
    }
  }

  getTriageLevel(): string {
    return RiskRating[this.riskRating()]
  }
}
