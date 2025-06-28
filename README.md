# Sistema de Gerenciamento de Fila de Atendimento (NeoLife)

Este projeto implementa o back-end **e o front-end** de um sistema para gerenciamento de fila de atendimento de pacientes em um pronto-socorro. O sistema permite o registro de pacientes, triagem, organização da fila e chamada para atendimento, com interface web moderna e responsiva.

> **Inspiração:** Estrutura inspirada em sistemas modernos de triagem hospitalar, seguindo protocolos reconhecidos, como o [Sistema de Triagem de Manchester](https://artmed.com.br/artigos/triagem-e-classificacao-de-risco-atuacao-do-enfermeiro).

---

## Requisitos Funcionais

| ID  | Requisito                           | Descrição                                                                                                                                           |
|-----|-------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| RF1 | Registrar Paciente                  | O sistema deve permitir o registro de pacientes, armazenando nome, CPF, e-mail e data de nascimento.                                                |
| RF2 | Realizar Triagem                    | Permitir a triagem do paciente, classificando o grau de risco/prioridade no atendimento.                                                            |
| RF3 | Gerenciar Fila de Atendimento       | Gerenciar a fila de atendimento, respeitando classificação de risco e ordem de chegada.                                                             |
| RF4 | Chamar Próximo da Fila              | O próximo paciente da fila pode ser chamado para atendimento, sendo removido da fila.                                                               |
| RF5 | Pesquisar Histórico de Atendimentos | Permitir consulta ao histórico de atendimentos de um paciente registrado.                                                                           |

---

## Regras de Negócio

1. O protocolo de triagem segue o [Sistema de Triagem de Manchester](https://artmed.com.br/artigos/triagem-e-classificacao-de-risco-atuacao-do-enfermeiro).
2. A fila de atendimento respeita a classificação de risco dos pacientes.
3. Pacientes com a mesma classificação de risco são atendidos por ordem de chegada.
4. Todos os dados dos pacientes são obrigatórios e validados pelo sistema.
5. Não é permitido registrar dois pacientes com o mesmo CPF.

---

## Estrutura do Projeto

```
NeoLife/
│
├── backend/                   # Todo o código e configs do back-end
│   ├── src/                   # Código-fonte (controllers, routes, services, models, middlewares)
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── main.ts
│   ├── config/                # Configurações (env, database, etc.)
│   ├── tests/                 # Testes unitários e de integração
│   ├── types/                 # Tipagens globais
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.ts
│   └── README.md
│
frontEnd/
│
├── public/                 # Arquivos estáticos (index.html, favicon, etc)
│
├── src/                    # Código-fonte principal
│   ├── assets/             # Imagens, fontes, estilos globais (SCSS)
│   ├── components/         # Componentes Vue reutilizáveis
│   ├── layouts/            # Layouts de páginas (estrutura base)
│   ├── pages/              # Telas principais do app
│   ├── router/             # Configuração de rotas
│   ├── store/              # Gerenciamento de estado global (ex: Pinia/Vuex)
│   ├── services/           # Serviços de API e helpers
│   ├── types/              # Tipagens TypeScript globais
│   ├── utils/              # Funções utilitárias
│   ├── App.vue             # Componente raiz
│   └── main.ts             # Arquivo principal de inicialização Vue
│
├── tests/                  # Testes unitários e2e/front-end
├── .env.example            # Exemplo de variáveis de ambiente
├── package.json
├── tsconfig.json
├── vue.config.ts          
├── README.md
```

## Requisitos Para Executar o Projeto

- Node.js 18+
- npm ou yarn

---

## Instalação das Dependências

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

## Front-end (Vue)

A interface web está na pasta `frontEnd/`, feita com Vue.js, SCSS e TypeScript, baseada no template [Vue Material Dashboard](https://www.creative-tim.com/product/vue-material-dashboard) e adaptada para o fluxo do NeoLife.

Para rodar o front-end:

```bash
cd frontEnd
npm install        # ou yarn install
npm run dev        # ou yarn dev
```

Acesse em `http://localhost:8080` (ou porta configurada).

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
- O front-end e o back-end podem ser executados separadamente.

---

## Colabore!

Pull requests e sugestões são bem-vindas! Confira as issues ou abra uma nova para contribuir.

---

**Atenção:** Esta documentação agora cobre o back-end **e** a interface front-end do projeto. Para detalhes específicos, consulte também o README da pasta `frontEnd`.

---

## Autores

- [Fabricio Fontenele](https://github.com/Fabricio-Fontenele)
- [Anjo Pedro Barbosa](https://github.com/oAnjophb)
- [Denis Nascimento](https://github.com/Denisnascimentor)
