<template>
  <div class="fila-triagem-page">
    <h2>
      <md-icon style="vertical-align: middle; color: #1976d2; margin-right: 6px"
        >format_list_numbered</md-icon
      >
      Fila de Triagem
    </h2>

    <div class="table-container">
      <table class="fila-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Entrada</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="atendimentos.length === 0">
            <td colspan="4" class="empty-row">
              Nenhum paciente aguardando triagem.
            </td>
          </tr>
          <tr v-for="a in atendimentos" :key="a.id_atendimento">
            <td>{{ a.nome_paciente }}</td>
            <td>{{ a.cpf }}</td>
            <td>{{ formatData(a.data_hora_entrada) }}</td>
            <td>
              <button
                class="btn-primario"
                @click="iniciarTriagem(a.id_atendimento)"
              >
                Iniciar Triagem
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="erro" class="erro-msg">{{ erro }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'FilaTriagem',
  data() {
    return {
      atendimentos: [],
      erro: '',
    }
  },
  async mounted() {
    try {
      const { data } = await axios.get('/api/fila')
      this.atendimentos = data
    } catch {
      this.erro = 'Erro ao carregar fila.'
    }
  },
  methods: {
    async iniciarTriagem(id_atendimento) {
      try {
        await axios.post(`/api/triagem/iniciar`, { id_atendimento })
        this.$router.push({
          name: 'Cadastro de Triagem',
          query: { id_atendimento },
        })
      } catch {
        this.erro = 'Erro ao iniciar triagem.'
      }
    },
    formatData(dataISO) {
      if (!dataISO) return ''
      const dt = new Date(dataISO)
      return (
        dt.toLocaleDateString('pt-BR') +
        ' ' +
        dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      )
    },
  },
}
</script>

<style scoped>
/* Deixa a página SEMPRE para a direita da sidebar fixa */
.fila-triagem-page {
  /* Bate com a sidebar fixa do layout! */
  padding: 32px 24px 32px 240px;
  min-height: 100vh;
  background: #f4f7fa;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}
h2 {
  margin-bottom: 24px;
  color: #1976d2;
  font-size: 2em;
  font-weight: 700;
  letter-spacing: 0.02em;
  width: 100%;
  max-width: 820px;
  text-align: left;
  display: flex;
  align-items: center;
}
.table-container {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 12px #0002;
  padding: 18px;
  width: 100%;
  max-width: 820px;
  overflow-x: auto;
}
.fila-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1.06em;
  background: #fff;
  min-width: 480px;
}
.fila-table th,
.fila-table td {
  padding: 11px 15px;
  text-align: left;
}
.fila-table th {
  background: #f1f5fa;
  color: #1976d2;
  font-weight: 700;
  border-bottom: 1.5px solid #e0e8f6;
  letter-spacing: 0.04em;
}
.fila-table tr {
  transition: background 0.14s;
}
.fila-table tr:hover {
  background: #f5faff;
}
.fila-table td {
  border-bottom: 1px solid #f1f5fa;
  color: #222;
  font-weight: 500;
}
.fila-table td.empty-row {
  text-align: center;
  color: #888;
  font-style: italic;
  background: #fafbfc;
}
.btn-primario {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 7px 20px;
  font-size: 1em;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.14s;
}
.btn-primario:hover {
  background: #1154a3;
}
.erro-msg {
  color: #d32f2f;
  font-weight: 600;
  margin-top: 18px;
  text-align: center;
}

/* Responsivo para sidebar estreita */
@media (max-width: 900px) {
  .fila-triagem-page {
    padding: 16px 2px 16px 68px;
  }
  .table-container {
    padding: 8px 0;
    max-width: 99vw;
  }
  h2 {
    max-width: 99vw;
  }
}
</style>
