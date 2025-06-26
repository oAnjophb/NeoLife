import { StatusType, Ticket } from '@/attending/ticket'
import { RiskRating } from '@/attending/triage'
import { Database } from '../Data/data_Base_Conection'

const db = Database.getDatabase()

const RISK_LIMITS: { [key: number]: number } = {
  1: 240, // Azul
  2: 120, // Verde
  3: 60, // Amarelo
  4: 30, // Laranja
  5: 10, // Vermelho
}
const PROMOTION_THRESHOLD = 0.85 // 85%

export class ServiceQueue {
  private heap: Ticket[] = []

  public get tickets(): Ticket[] {
    return [...this.heap]
  }

  private compare(a: Ticket, b: Ticket): number {
    return a.prioridade - b.prioridade
  }

  addTicket(ticket: Ticket): void {
    this.heap.push(ticket)
    this.heapifyUp()
    this.boostTicketsByWaitTime()
    this.saveFilaPrioridade()
    console.log(
      `Paciente ${ticket.paciente.nome} adicionado à fila com prioridade ${RiskRating[ticket.prioridade]}.`,
    )
  }

  callNextTicket(): Ticket | null {
    if (this.heap.length === 0) {
      console.log('Nenhum paciente aguardando.')
      return null
    }
    this.boostTicketsByWaitTime()
    const ticket = this.extractMax()
    this.saveFilaPrioridade()
    console.log(
      `\nChamando paciente ${ticket.paciente.nome} com prioridade ${RiskRating[ticket.prioridade]}.`,
    )
    return ticket
  }

  removePatient(id_paciente: number): boolean {
    const index = this.heap.findIndex(
      (t) => t.paciente.id_paciente === id_paciente,
    )
    if (index === -1) return false
    const last = this.heap.length - 1
    if (index !== last) {
      ;[this.heap[index], this.heap[last]] = [this.heap[last], this.heap[index]]
    }
    this.heap.pop()
    this.heapifyDownFrom(index)
    this.saveFilaPrioridade()
    return true
  }

  public getOrderedQueue(): Ticket[] {
    return [...this.heap]
      .filter((t) => t.status === StatusType.readyForConsult)
      .sort((a, b) => {
        if (b.prioridade !== a.prioridade) {
          return b.prioridade - a.prioridade
        }
        return (
          new Date(a.dataTriagem).getTime() - new Date(b.dataTriagem).getTime()
        )
      })
  }

  private boostTicketsByWaitTime(): void {
    const now = Date.now()
    const RED_PRIORITY = 5

    // Separe os tickets por categoria
    const reds: Ticket[] = []
    const boosted: Ticket[] = []
    const others: Ticket[] = []

    for (const ticket of this.heap) {
      if (ticket.prioridade === RED_PRIORITY) {
        reds.push(ticket)
        continue
      }
      const limite = RISK_LIMITS[ticket.prioridade]
      if (!limite) {
        others.push(ticket)
        continue
      }
      const inicio = new Date(ticket.dataTriagem).getTime()
      const minutosEsperados = (now - inicio) / 60000
      if (minutosEsperados >= PROMOTION_THRESHOLD * limite) {
        boosted.push(ticket)
      } else {
        others.push(ticket)
      }
    }

    // Ordene os boosted por tempo de triagem mais antigo
    boosted.sort(
      (a, b) =>
        new Date(a.dataTriagem).getTime() - new Date(b.dataTriagem).getTime(),
    )

    // Os vermelhos sempre ficam no topo!
    this.heap = [...reds, ...boosted, ...others]
  }

  private heapifyUp(): void {
    let index = this.heap.length - 1
    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2)
      if (this.compare(this.heap[index], this.heap[parentIndex]) > 0) {
        ;[this.heap[index], this.heap[parentIndex]] = [
          this.heap[parentIndex],
          this.heap[index],
        ]
        index = parentIndex
      } else {
        break
      }
    }
  }

  private extractMax(): Ticket {
    const max = this.heap[0]
    const end = this.heap.pop()!
    if (this.heap.length > 0) {
      this.heap[0] = end
      this.heapifyDownFrom(0)
    }
    return max
  }

  private heapifyDownFrom(index: number): void {
    const length = this.heap.length
    while (true) {
      let left = 2 * index + 1
      let right = 2 * index + 2
      let swap = index

      if (left < length && this.compare(this.heap[left], this.heap[swap]) > 0)
        swap = left
      if (right < length && this.compare(this.heap[right], this.heap[swap]) > 0)
        swap = right
      if (swap === index) break
      ;[this.heap[index], this.heap[swap]] = [this.heap[swap], this.heap[index]]
      index = swap
    }
  }

  // ---- SALVAR A FILA NO BANCO (better-sqlite3, síncrono) ----
  saveFilaPrioridade() {
    db.prepare('DELETE FROM FILA_PRIORIDADE').run()
    const insert = db.prepare(
      'INSERT INTO FILA_PRIORIDADE (id_paciente) VALUES (?)',
    )
    for (const ticket of this.heap) {
      insert.run(ticket.paciente.id_paciente)
    }
  }

  // ---- CARREGAR A FILA DO BANCO (chame ao iniciar o app) ----
  loadFilaPrioridade(getTicketFromPacienteId: (id: number) => Ticket | null) {
    this.heap = []
    const rows = db
      .prepare('SELECT id_paciente FROM FILA_PRIORIDADE')
      .all() as { id_paciente: number }[]
    for (const row of rows) {
      const ticket = getTicketFromPacienteId(row.id_paciente)
      if (ticket) this.heap.push(ticket)
    }
  }
}

export const serviceQueue = new ServiceQueue()
