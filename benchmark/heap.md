# Comparação: GenericHeap vs ServiceQueue

| Critério           | GenericHeap           | ServiceQueue                          |
|--------------------|----------------------|---------------------------------------|
| **Performance**    | Heap padrão, eficiente| Heap padrão, mas removePatient é lenta|
| **Tamanho Código** | Menor (~56 linhas)   | Maior (~89 linhas)                    |
| **Complexidade**   | Menos complexa, genérica | Mais complexa, acoplada ao domínio|
| **Flexibilidade**  | Alta (qualquer tipo, qualquer comparador) | Baixa (só Ticket, max-heap) |
| **Reutilização**   | Alta                 | Baixa                                 |

---

## Observações

- **GenericHeap** é uma estrutura genérica, reutilizável para qualquer tipo de dado e qualquer função de comparação (min-heap ou max-heap).
- **ServiceQueue** é especializada para o domínio de Tickets, com métodos extras e lógica customizada, porém menos flexível e com remoção arbitrária bem menos eficiente.
- Para aplicações genéricas ou reutilizáveis, prefira o GenericHeap.
- Para aplicações específicas (como filas de atendimento com regras fixas), ServiceQueue pode ser suficiente, mas é menos eficiente em operações especiais.
