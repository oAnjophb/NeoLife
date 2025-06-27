# Sistema de Gerenciamento de Fila de Atendimento (NeoLife)

Este projeto implementa o back-end de um sistema para gerenciamento de fila de atendimento de pacientes em um pronto-socorro. O sistema permite o registro de pacientes, triagem, organização da fila de atendimento e consulta de histórico, seguindo regras importantes para priorização e segurança dos dados.

> **Inspiração:** Estrutura inspirada em sistemas modernos de triagem hospitalar, seguindo protocolos reconhecidos, como o [Sistema de Triagem de Manchester](https://artmed.com.br/artigos/triagem-e-classificacao-de-risco-atuacao-do-enfermeiro).

---

## Requisitos Funcionais

| ID  | Requisito                           | Descrição                                                                                                                                                                                  |
|-----|-------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| RF1 | Registrar Paciente                  | O sistema deve permitir o registro de pacientes, armazenando nome, CPF, e-mail e data de nascimento.                                                 |
| RF2 | Realizar Triagem                    | Permitir a triagem do paciente, classificando o grau de risco/prioridade no atendimento.                                                             |
| RF3 | Gerenciar Fila de Atendimento       | Gerenciar a fila de atendimento, respeitando classificação de risco e ordem de chegada.                                                              |
| RF4 | Chamar Próximo da Fila              | O próximo paciente da fila pode ser chamado para atendimento, sendo removido da fila.                                                                |
| RF5 | Pesquisar Histórico de Atendimentos | Permitir consulta ao histórico de atendimentos de um paciente registrado.                                                                            |

---

## Regras de Negócio

1. O protocolo de triagem segue o [Sistema de Triagem de Manchester](https://artmed.com.br/artigos/triagem-e-classificacao-de-risco-atuacao-do-enfermeiro).
2. A fila de atendimento respeita a classificação de risco dos pacientes.
3. Pacientes com a mesma classificação de risco são atendidos por ordem de chegada.
4. Todos os dados dos pacientes são obrigatórios e validados pelo sistema.
5. Não é permitido registrar dois pacientes com o mesmo CPF.

---

## Estrutura do Projeto

- **src/**: Código fonte principal (rotas, controladores, serviços, modelos, etc.)
- **types/**: Tipagens e definições TypeScript
- **JSON/**: Armazenamento de dados em formato JSON (se aplicável)
- **package.json**: Dependências e scripts do projeto
- **jest.config.ts / jest.coverage.config.ts**: Configurações de testes
- **tsconfig.json**: Configuração do TypeScript

> Para mais detalhes sobre os arquivos, acesse a [pasta backEnd no GitHub](https://github.com/oAnjophb/PROJETO-INTEGRADOR/tree/main/backEnd).

---

## Requisitos Para Executar o Projeto

- Node.js 18+
- npm ou yarn

### Instalação das Dependências

Crie um ambiente isolado se desejar (opcional) e depois instale as dependências:

```bash
npm install
# ou
yarn install
```

---

## Executando o Projeto

Para rodar o servidor (ajuste o comando conforme seu script):

```bash
# Exemplo comum:
npm start
# ou
yarn start
```

Para rodar em modo desenvolvimento (com hot reload):

```bash
npm run dev
# ou
yarn dev
```

---

## Executando os Testes

Para executar os testes automatizados:

```bash
npm test
# ou
yarn test
```

Para cobertura de código:

```bash
npm run coverage
# ou
yarn coverage
```

> Os comandos podem variar conforme os scripts do `package.json`.

---

## Observações

- Certifique-se de configurar corretamente variáveis de ambiente e banco de dados, caso aplicável.
- O projeto utiliza TypeScript e segue boas práticas de lint e formatação.

---

## Colabore!

Pull requests e sugestões são bem-vindas! Confira as issues ou abra uma nova para contribuir.

---

**Atenção:** Esta documentação cobre apenas o back-end do projeto. Para o front-end, consulte a respectiva pasta/repositório..
