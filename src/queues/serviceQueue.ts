import { Ticket } from '@/attending/ticket'
import { RiskRating } from '@/attending/triage'

export class ServiceQueue {
  private heap: Ticket[] = []

  private compare(a: Ticket, b: Ticket): number {
    return b.prioridade - a.prioridade
  }

  addTicket(ticket: Ticket): void {
    this.heap.push(ticket)
    this.heapifyUp()
    console.log(
      `Paciente ${ticket.paciente.name} adicionado à fila com prioridade ${RiskRating[ticket.prioridade]}.`,
    )
  }

  callNextTicket(): Ticket | null {
    if (this.heap.length === 0) {
      console.log('Nenhum paciente aguardando.')
      return null
    }
    const ticket = this.extractMax()
    console.log(
      `\nChamando paciente ${ticket.paciente.name} com prioridade ${RiskRating[ticket.prioridade]}.`,
    )
    return ticket
  }

  removePatient(id: number): boolean {
    const index = this.heap.findIndex((t) => t.paciente.id === id)
    if (index === -1) return false
    const last = this.heap.length - 1
    if (index !== last) {
      ;[this.heap[index], this.heap[last]] = [this.heap[last], this.heap[index]]
    }
    this.heap.pop()
    this.heapifyDownFrom(index)
    return true
  }

  listQueue(): void {
    console.log('\nEstado atual da fila:')
    const ordered = [...this.heap].sort((a, b) => a.prioridade - b.prioridade)

    for (const ticket of ordered) {
      console.log(
        `Paciente: ${ticket.paciente.name}, Prioridade: ${RiskRating[ticket.prioridade]}`,
      )
    }
  }

  private heapifyUp(): void {
    let index = this.heap.length - 1
    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2)
      if (this.compare(this.heap[index], this.heap[parentIndex]) > 0) {
        const temp = this.heap[index]
        this.heap[index] = this.heap[parentIndex]
        this.heap[parentIndex] = temp
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
    const element = this.heap[index]
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
}