import { Ticket } from '@/attending/ticket'

export class TriageQueue {
  private queue: Ticket[] = []

  setQueue(newQueue: Ticket[]): void {
    this.queue = [...newQueue]
  }

  addTicket(ticket: Ticket): void {
    this.queue.push(ticket)
  }

  callNextTicket(): Ticket | null {
    if (this.queue.length === 0) return null
    return this.queue.shift()!
  }

  removePatient(id_paciente: number): boolean {
    const index = this.queue.findIndex(
      (t) => t.paciente.id_paciente === id_paciente,
    )
    if (index === -1) return false
    this.queue.splice(index, 1)
    return true
  }

  get tickets(): Ticket[] {
    return [...this.queue]
  }

  clear(): void {
    this.queue = []
  }
}

export const triageQueue = new TriageQueue()
