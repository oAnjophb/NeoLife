// src/FilaTriagem.ts

import { Patient } from "@/Patient";

export type PriorityLevel = 1 | 2 | 3 | 4 | 5;

export class FilaTriagem {
  private filas: Record<PriorityLevel, Patient[]> = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  };

  adicionarPaciente(prioridade: PriorityLevel, paciente: Patient): void {
    this.filas[prioridade].push(paciente);
    console.log(`Paciente ${paciente.name} adicionado à fila ${prioridade}`);
  }

  chamarProximoPaciente(): Patient | null {
    for (const prioridade of [1, 2, 3, 4, 5] as PriorityLevel[]) {
      const fila = this.filas[prioridade];
      if (fila.length > 0) {
        const paciente = fila.shift()!;
        console.log(`Chamando paciente ${paciente.name} da fila ${prioridade}`);
        return paciente;
      }
    }
    console.log("Nenhum paciente aguardando.");
    return null;
  }

  listarFilas(): void {
    for (const prioridade of [1, 2, 3, 4, 5] as PriorityLevel[]) {
      console.log(
        `Prioridade ${prioridade}: ${this.filas[prioridade].map((p) => p.name).join(", ")}`
      );
    }
  }
  removerPaciente(id: number): boolean {
    for (const prioridade of [1, 2, 3, 4, 5] as PriorityLevel[]) {
      const fila = this.filas[prioridade];
      const index = fila.findIndex((p) => p.id === id);

      if (index !== -1) {
        const removido = fila.splice(index, 1)[0];
        console.log(
          ` Paciente ${removido.name} removido da fila ${prioridade}`
        );
        return true;
      }
    }

    console.log(" Paciente não encontrado em nenhuma fila.");
    return false;
  }
}
