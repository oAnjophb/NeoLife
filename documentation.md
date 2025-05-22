# Documentação Técnica da Estrutura de Dados: ServiceQueue

## Visão Geral

A estrutura `ServiceQueue` implementa uma fila de prioridade baseada em um heap binário, destinada ao gerenciamento de tickets de atendimento, onde cada ticket representa um paciente com uma prioridade associada (tipicamente determinada por critérios de triagem).

Essa estrutura garante que o paciente de maior prioridade seja sempre atendido primeiro, respeitando princípios de urgência médica.

---

## Componentes Principais

### 1. Estrutura Interna

- **heap: Ticket[]**
  - Array privado que representa o heap binário.
  - Cada elemento é um objeto do tipo `Ticket`.

### 2. Métodos Públicos

- **addTicket(ticket: Ticket): void**
  - Adiciona um novo ticket ao heap e reorganiza para manter a propriedade de heap de máxima prioridade.
  - Exibe no console o paciente adicionado e sua prioridade.

- **callNextTicket(): Ticket | null**
  - Remove e retorna o ticket de maior prioridade (raiz do heap).
  - Caso a fila esteja vazia, retorna `null`.
  - Exibe no console o paciente chamado e sua prioridade.

- **removePatient(id: number): boolean**
  - Remove um paciente da fila pelo seu ID.
  - Reorganiza o heap após a remoção.
  - Retorna `true` se o paciente foi encontrado e removido, `false` caso contrário.

- **listQueue(): void**
  - Lista todos os pacientes presentes na fila, mostrando nome e prioridade.

---

## Métodos Privados e Algoritmos

- **compare(a: Ticket, b: Ticket): number**
  - Compara dois tickets com base em sua prioridade.
  - Retorna valor negativo se `a` tem menor prioridade que `b`, positivo se maior.

- **heapifyUp(): void**
  - Reorganiza o heap após adição de novo ticket, subindo o elemento enquanto sua prioridade for maior que a do pai.

- **extractMax(): Ticket**
  - Remove e retorna o ticket de maior prioridade do heap.
  - Substitui a raiz pelo último elemento e reorganiza para manter a propriedade do heap.

- **heapifyDown(): void**
  - Reorganiza o heap descendo a raiz até que a propriedade de máxima prioridade seja restabelecida.

- **reorganizeHeap(): void**
  - Reorganiza todo o heap, útil principalmente após remoção arbitrária de um elemento.

- **heapifyDownFrom(index: number): void**
  - Versão customizada do heapifyDown para reorganizar a partir de um índice específico (usado em reorganizeHeap).

---

## Fluxo de Prioridade

- A prioridade é determinada pelo campo `prioridade` do ticket.
- O paciente com maior valor de prioridade será atendido primeiro.

---

## Dependências Externas

- **Ticket**: Classe que representa o ticket de atendimento, tipicamente importada de `@/attending/ticket`.
- **RiskRating**: Enum ou objeto que mapeia prioridades para descrições, importado de `@/attending/triage`.

---

## Exemplos de Uso

```typescript
const fila = new ServiceQueue()
fila.addTicket(ticket1)
fila.addTicket(ticket2)
fila.listQueue()
const proximo = fila.callNextTicket()
fila.removePatient(ticket1.paciente.id)
```

---

## Resumo

A estrutura `ServiceQueue` oferece uma solução eficiente para gerenciamento de filas de atendimento por prioridade, utilizando um heap binário para garantir operações rápidas de inserção, remoção e obtenção do próximo paciente prioritário.
