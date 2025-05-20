
export class MaxHeap<T> {
  private heap: T[] = []
  private comparator: (a: T, b: T) => number

  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator
  }
  insert(value: T): void {
    this.heap.push(value)
    this.heapifyUp()
  }

  extractMax(): T | null {
    if (this.heap.length === 0) return null
    const max = this.heap[0]
    const end = this.heap.pop()
    if (this.heap.length > 0) {
      this.heap[0] = end!
      this.heapifyDown()
    }
    return max
  }
  peek(): T | null {
    return this.heap.length > 0 ? this.heap[0] : null
  }
  size(): number {
    return this.heap.length
  }
  private heapifyUp(): void {
    let index = this.heap.length - 1
    const element = this.heap[index]
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2)
      const parent = this.heap[parentIndex]
      if (this.comparator(element, parent) <= 0) break
      this.heap[index] = parent
      index = parentIndex
    }
    this.heap[index] = element
  }
  private heapifyDown(): void {
    let index = 0
    const length = this.heap.length
    const element = this.heap[0]
    while (true) {
      let leftChildIndex = 2 * index + 1
      let rigthChildIndex = 2 * index + 2
      let swapIndex = index

      if (
        leftChildIndex < length &&
        this.comparator(this.heap[leftChildIndex], this.heap[swapIndex]) > 0
      ) {
        swapIndex = leftChildIndex
      }

      if (
        rigthChildIndex < length &&
        this.comparator(this.heap[rigthChildIndex], this.heap[swapIndex]) > 0
      ) {
        swapIndex = rigthChildIndex
      }

      if ((swapIndex = index)) break

      this.heap[index] = this.heap[swapIndex]
      index = swapIndex
    }
    this.heap[index] = element
  }
}
