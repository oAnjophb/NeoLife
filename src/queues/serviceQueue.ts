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
    const index = this.heap.findIndex((ticket) => ticket.paciente.id === id)
    if (index === -1) {
      console.log('Paciente não encontrado na fila.')
      return false
    }
    this.heap.splice(index, 1)
    this.reorganizeHeap()
    console.log(`Paciente com ID ${id} removido da fila.`)
    return true
  }

  listQueue(): void {
    console.log('\nEstado atual da fila:')

    this.orderedQueue()
  }

  
  orderedQueue(): void {
  const ordered = [...this.heap].sort((a, b) => a.prioridade - b.prioridade)
  
  for (const paciente of ordered) {
    console.log(`Paciente: ${paciente.paciente.name}, Prioridade: ${RiskRating[paciente.prioridade]}`);
  }
}

private heapifyUp(): void {
  let index = this.heap.length - 1;
  while (index > 0) {
    let parentIndex = Math.floor((index - 1) / 2);
    if (this.compare(this.heap[index], this.heap[parentIndex]) > 0) {

      const temp = this.heap[index];
      this.heap[index] = this.heap[parentIndex];
      this.heap[parentIndex] = temp;
      index = parentIndex;
    } else {
      break;
    }
  }
}

  private extractMax(): Ticket {
    const max = this.heap[0]
    const end = this.heap.pop()!
    if (this.heap.length > 0) {
      this.heap[0] = end
      this.heapifyDown()
    }
    return max
  }

  private heapifyDown(): void {
    let index = 0
    const length = this.heap.length
    
    while (true) {
      let leftChildIndex = 2 * index + 1
      let rightChildIndex = 2 * index + 2
      let swapIndex = index

      if (
        leftChildIndex < length &&
        this.compare(this.heap[leftChildIndex], this.heap[index]) > 0
      ) {
        swapIndex = leftChildIndex
      }

      if (
        rightChildIndex < length &&
        this.compare(this.heap[rightChildIndex], this.heap[index]) > 0 ) {
        swapIndex = rightChildIndex
      }

      if (swapIndex === index) break
      
      const temp = this.heap[index];
      this.heap[index] = this.heap[swapIndex]
      this.heap[swapIndex] = temp

      index = swapIndex
    }
  }

  private reorganizeHeap(): void {
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this.heapifyDownFrom(i)
    }
  }

  private heapifyDownFrom(index: number): void {
    const length = this.heap.length
    const element = this.heap[index]
    while (true) {
      let leftChildIndex = 2 * index + 1
      let rightChildIndex = 2 * index + 2
      let swapIndex = null

      if (
        leftChildIndex < length &&
        this.compare(this.heap[leftChildIndex], element) > 0
      ) {
        swapIndex = leftChildIndex
      }

      if (
        rightChildIndex < length &&
        this.compare(this.heap[rightChildIndex], element) > 0 &&
        this.compare(this.heap[rightChildIndex], this.heap[leftChildIndex]) > 0
      ) {
        swapIndex = rightChildIndex
      }

      if (swapIndex === null) break
      this.heap[index] = this.heap[swapIndex]
      index = swapIndex
    }
    this.heap[index] = element
  }
}
