import { Ticket } from '@/attending/ticket'
import { MaxHeap } from './Queue'
import { RiskRating } from '@/employes/Nurse'
import { Patient } from '@/Patient'

export class FilaTriagem {
  private heap: MaxHeap<Ticket>

  constructor() {
    this.heap = new MaxHeap((a, b) => a.prioridade - b.prioridade)
  }

  adicionarSenha(senha: Ticket): void {
    this.heap.insert(senha)
    console.log(
      `Paciente ${senha.paciente.name} adicionado à heap com prioridade ${RiskRating[senha.prioridade]}`,
    )
  }

  chamarProximoPaciente(): Patient | null {
    const senha = this.heap.extractMax()
    if (senha) {
      console.log(
        `Chamando paciente ${senha.paciente.name} com prioridade ${RiskRating[senha.prioridade]}`,
      )
      return senha.paciente
    } else {
      console.log('Nenhum paciente aguardando.')
      return null
    }
  }

  removerPaciente(id: number): boolean {
    const temp: Ticket[] = []
    let found = false

    while (this.heap.size() > 0) {
      const s = this.heap.extractMax()!
      if (s.paciente.id === id) {
        console.log(`Paciente ${s.paciente.name} removido da fila`)
        found = true
        break
      } else {
        temp.push(s)
      }
    }

    for (const s of temp) {
      this.heap.insert(s)
    }

    if (!found) {
      console.log('Paciente não encontrado em nenhuma fila.')
    }

    return found
  }

  listarFilas(): void {
    console.log(
      'Listagem da fila de pacientes não é suportada diretamente com heap.',
    )
  }
}
