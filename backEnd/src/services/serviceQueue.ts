import { StatusType, Ticket } from '@/attending/ticket'
import { RiskRating } from '@/attending/triage'
import { Database } from '../Data/data_Base_Conection'

const db = Database.getDatabase()

const RISK_LIMITS: { [key: number]: number } = {
  1: 240,
  2: 120,
  3: 60,
  4: 30,  
  5: 0,  
}
const URGENT_THRESHOLD_MINUTES = 5 

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
    const ordered = this.getOrderedQueue()
    const nextTicket = ordered[0]
    // Remove o paciente chamado da heap
    this.removePatient(nextTicket.paciente.id_paciente)
    this.saveFilaPrioridade()
    console.log(
      `\nChamando paciente ${nextTicket.paciente.nome} com prioridade ${RiskRating[nextTicket.prioridade]}.`,
    )
    return nextTicket
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
    const now = Date.now()
    const urgent: Ticket[] = []
    const normal: Ticket[] = []

    for (const t of this.heap) {
      if (t.status !== StatusType.readyForConsult) continue
      const limite = RISK_LIMITS[t.prioridade]
      const inicio = new Date(t.dataTriagem).getTime()
      const restante = limite - ((now - inicio) / 60000)
      if (restante <= URGENT_THRESHOLD_MINUTES) {
        urgent.push(t)
      } else {
        normal.push(t)
      }
    }

    urgent.sort((a, b) => {
 
      const limiteA = RISK_LIMITS[a.prioridade]
      const limiteB = RISK_LIMITS[b.prioridade]
      const inicioA = new Date(a.dataTriagem).getTime()
      const inicioB = new Date(b.dataTriagem).getTime()
      const restanteA = limiteA - ((now - inicioA) / 60000)
      const restanteB = limiteB - ((now - inicioB) / 60000)
      if (restanteA !== restanteB) return restanteA - restanteB

      return inicioA - inicioB
    })

    normal.sort((a, b) => {
     
      if (b.prioridade !== a.prioridade) {
        return b.prioridade - a.prioridade
      }
      const limite = RISK_LIMITS[a.prioridade]
      const inicioA = new Date(a.dataTriagem).getTime()
      const inicioB = new Date(b.dataTriagem).getTime()
      const restanteA = limite - ((now - inicioA) / 60000)
      const restanteB = limite - ((now - inicioB) / 60000)
      if (restanteA !== restanteB) return restanteA - restanteB
      return inicioA - inicioB
    })

    return [...urgent, ...normal]
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

  saveFilaPrioridade() {
    db.prepare('DELETE FROM FILA_PRIORIDADE').run()
    const insert = db.prepare(
      'INSERT INTO FILA_PRIORIDADE (id_paciente) VALUES (?)',
    )
    for (const ticket of this.heap) {
      insert.run(ticket.paciente.id_paciente)
    }
  }

  loadFilaPrioridade(getTicketFromPacienteId: (id: number) => Ticket | null) {
    this.heap = []
    const rows = db
      .prepare('SELECT id_paciente FROM FILA_PRIORIDADE')
      .all() as { id_paciente: number }[]
    console.log('Pacientes na FILA_PRIORIDADE:', rows)
    for (const row of rows) {
      const ticket = getTicketFromPacienteId(row.id_paciente)
      console.log(`Ticket para paciente ${row.id_paciente}:`, ticket)
      if (ticket) this.heap.push(ticket)
    }
  }
}

export const serviceQueue = new ServiceQueue()