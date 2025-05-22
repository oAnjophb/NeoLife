type Comparator<T> = (a: T, b: T) => number;

export class GenericHeap<T> {
  private heap: T[] = [];
  private comparator: Comparator<T>;

  constructor(comparator: Comparator<T>) {
    this.comparator = comparator;
  }

  size(): number {
    return this.heap.length;
  }

  peek(): T | undefined {
    return this.heap[0];
  }

  push(value: T): void {
    this.heap.push(value);
    this.heapifyUp();
  }

  pop(): T | undefined {
    if (this.size() === 0) return undefined;
    const top = this.heap[0];
    const end = this.heap.pop()!;
    if (this.size() > 0) {
      this.heap[0] = end;
      this.heapifyDown();
    }
    return top;
  }

  private heapifyUp() {
    let idx = this.heap.length - 1;
    const value = this.heap[idx];
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const parent = this.heap[parentIdx];
      if (this.comparator(value, parent) >= 0) break;
      this.heap[idx] = parent;
      idx = parentIdx;
    }
    this.heap[idx] = value;
  }

  private heapifyDown() {
    let idx = 0;
    const length = this.heap.length;
    const value = this.heap[0];
    while (true) {
      let leftIdx = 2 * idx + 1;
      let rightIdx = 2 * idx + 2;
      let smallest = idx;

      if (
        leftIdx < length &&
        this.comparator(this.heap[leftIdx], this.heap[smallest]) < 0
      ) {
        smallest = leftIdx;
      }
      if (
        rightIdx < length &&
        this.comparator(this.heap[rightIdx], this.heap[smallest]) < 0
      ) {
        smallest = rightIdx;
      }
      if (smallest === idx) break;
      this.heap[idx] = this.heap[smallest];
      idx = smallest;
    }
    this.heap[idx] = value;
  }
}\\