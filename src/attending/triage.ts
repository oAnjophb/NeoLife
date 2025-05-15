import { RiskRating } from "@/employes/Nurse";
import { Patient } from "@/Patient";

export class Triage {
  public symptoms: string[] = [];
  public bloodPress: number = 0;
  public temp: number = 0;
  public saturation: number = 0;

  constructor(public patient: Patient) {}

  addSymptom(symptom: string): void {
    this.symptoms.push(symptom);
  }

  recordVitals(): string[] {
    return [
      `Pressão arterial: ${this.bloodPress} mmHg`,
      `Temperatura: ${this.temp} °C`,
      `Saturação: ${this.saturation}%`,
    ];
  }

  riskRating(): RiskRating {
    switch (true) {
      case this.saturation < 90:
      case this.temp >= 40:
      case this.bloodPress >= 180:
        return RiskRating.Red;

      case this.saturation < 94:
      case this.temp >= 38.5:
        return RiskRating.orange;

      case this.symptoms.includes("dor moderada"):
        return RiskRating.yellow;

      case this.symptoms.includes("dor leve"):
        return RiskRating.grenn;

      default:
        return RiskRating.blue;
    }
  }

  getTriageLevel(): string {
    return RiskRating[this.riskRating()];
  }
  
}
