<template>
  <div class="form-centralizado">
    <md-card>
      <md-card-header class="custom-card-header">
        <span class="header-icon-title">
          <h4 class="title">Cadastro de Triagem</h4>
        </span>
      </md-card-header>
      <md-card-content>
        <form @submit.prevent="cadastrarTriagem">
          <div class="form-row">
            <md-field>
              <label>Paciente</label>
              <md-input :value="pacienteInfo" disabled />
            </md-field>
          </div>
          <div class="form-row">
            <div class="date-static-label">
              <label class="label-estatico" for="data_triagem"
                >Data da Triagem</label
              >
              <input
                id="data_triagem"
                v-model="triagem.data_triagem"
                type="date"
                class="md-input md-theme-default"
                required
              />
            </div>
            <div class="date-static-label">
              <label class="label-estatico" for="hora_triagem"
                >Hora da Triagem</label
              >
              <input
                id="hora_triagem"
                v-model="triagem.hora_triagem"
                type="time"
                class="md-input md-theme-default"
                required
              />
            </div>
            <md-field>
              <label>Classificação de Risco</label>
              <md-select
                v-model.number="triagem.id_classificacao_risco"
                required
              >
                <md-option :value="5" class="risk-red"
                  >Vermelho (emergência)</md-option
                >
                <md-option :value="4" class="risk-orange"
                  >Laranja (muito urgente)</md-option
                >
                <md-option :value="3" class="risk-yellow"
                  >Amarelo (urgente)</md-option
                >
                <md-option :value="2" class="risk-green"
                  >Verde (pouco urgente)</md-option
                >
                <md-option :value="1" class="risk-blue"
                  >Azul (não urgente)</md-option
                >
              </md-select>
            </md-field>
          </div>
          <div class="form-row">
            <md-field>
              <label>Pressão Sanguínea (mmHg)</label>
              <md-input
                v-model="triagem.pressao_sanguinea"
                type="text"
                placeholder="Ex: 120/80"
              />
            </md-field>
            <md-field>
              <label>Temperatura (°C)</label>
              <md-input
                v-model.number="triagem.temperatura"
                type="number"
                step="0.1"
                placeholder="Ex: 36.5"
              />
            </md-field>
            <md-field>
              <label>Saturação O₂ (%)</label>
              <md-input
                v-model.number="triagem.saturacao"
                type="number"
                placeholder="Ex: 98"
              />
            </md-field>
          </div>
          <div class="form-row">
            <md-field>
              <label>Sintomas</label>
              <md-input
                v-model="triagem.sintomas"
                placeholder="Descreva os sintomas do paciente"
                required
              />
            </md-field>
          </div>
          <div class="actions-row">
            <md-button class="md-primary" type="submit">
              <md-icon>check</md-icon> Salvar Triagem
            </md-button>
          </div>
        </form>
      </md-card-content>
    </md-card>
    <md-snackbar
      :md-active.sync="feedback.open"
      :md-duration="3500"
      md-position="left"
      class="success-snackbar"
    >
      <span>
        <md-icon style="color: #43a047; vertical-align: middle"
          >check_circle</md-icon
        >
        {{ feedback.message }}
      </span>
    </md-snackbar>
    <md-snackbar
      :md-active.sync="erroFeedback.open"
      :md-duration="5000"
      md-position="left"
      class="error-snackbar"
    >
      <span>
        <md-icon style="color: #e53935; vertical-align: middle">error</md-icon>
        {{ erroFeedback.message }}
      </span>
    </md-snackbar>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CadastroTriagem',
  data() {
    const today = new Date().toISOString().slice(0, 10)
    const now = new Date().toTimeString().slice(0, 5)
    return {
      triagem: {
        data_triagem: today,
        hora_triagem: now,
        id_classificacao_risco: null,
        pressao_sanguinea: '',
        temperatura: null,
        saturacao: null,
        sintomas: '',
      },
      id_atendimento: null,
      id_paciente: null,
      nome_paciente: '',
      cpf_paciente: '',
      feedback: {
        open: false,
        message: '',
      },
      erroFeedback: {
        open: false,
        message: '',
      },
    }
  },
  computed: {
    pacienteInfo() {
      if (this.nome_paciente && this.cpf_paciente)
        return `${this.nome_paciente} (CPF: ${this.cpf_paciente})`
      else if (this.nome_paciente) return this.nome_paciente
      else return ''
    },
  },
  async mounted() {
    const id_atendimento = this.$route.query.id_atendimento
    if (!id_atendimento) {
      this.erroFeedback.message = 'ID do atendimento não informado!'
      this.erroFeedback.open = true
      return
    }
    this.id_atendimento = id_atendimento

    try {
      const { data } = await axios.get('/api/fila-triagem')
      const atendimento = data.find(
        (at) => String(at.id_atendimento) === String(id_atendimento)
      )
      if (atendimento) {
        this.id_paciente = atendimento.id_paciente
        this.nome_paciente = atendimento.nome_paciente
        this.cpf_paciente = atendimento.cpf
      } else {
        this.erroFeedback.message = 'Atendimento não encontrado na fila!'
        this.erroFeedback.open = true
      }
    } catch (err) {
      this.erroFeedback.message = 'Erro ao buscar paciente da fila.'
      this.erroFeedback.open = true
    }
  },
  methods: {
    async cadastrarTriagem() {
      if (!this.id_paciente || !this.id_atendimento) {
        this.erroFeedback.message = 'Dados do paciente ou atendimento ausentes!'
        this.erroFeedback.open = true
        return
      }
      const [year, month, day] = this.triagem.data_triagem.split('-')
      const [hour, minute] = this.triagem.hora_triagem.split(':')
      const localDate = new Date(year, month - 1, day, hour, minute)
      const dataHoraTriagem = localDate.toISOString()
      const payload = {
        id_paciente: this.id_paciente,
        id_atendimento: this.id_atendimento,
        data_triagem: dataHoraTriagem,
        id_classificacao_risco: this.triagem.id_classificacao_risco,
        sintomas: this.triagem.sintomas,
        temperatura: this.triagem.temperatura,
        saturacao: this.triagem.saturacao,
        pressao_sanguinea: this.triagem.pressao_sanguinea,
      }
      const token = localStorage.getItem('token')
      if (!token) {
        this.erroFeedback.message =
          'Você precisa estar logado para cadastrar uma triagem!'
        this.erroFeedback.open = true
        return
      }
      try {
        await axios.post('http://localhost:3001/api/triagem', payload, {
          headers: { Authorization: 'Bearer ' + token },
        })
        this.feedback.message =
          'Triagem realizada com sucesso! O paciente foi classificado e direcionado para o próximo atendimento.'
        this.feedback.open = true
        const today = new Date().toISOString().slice(0, 10)
        const now = new Date().toTimeString().slice(0, 5)
        this.triagem = {
          data_triagem: today,
          hora_triagem: now,
          id_classificacao_risco: null,
          pressao_sanguinea: '',
          temperatura: null,
          saturacao: null,
          sintomas: '',
        }
        this.$router.push({ name: 'FilaTriagem' })
      } catch (err) {
        this.erroFeedback.message =
          'Erro ao cadastrar triagem: ' +
          (err.response?.data?.erro || err.message) +
          (err.response?.data?.detalhes
            ? '\nDetalhes: ' + err.response.data.detalhes
            : '')
        this.erroFeedback.open = true
      }
    },
  },
}
</script>

<style scoped>
.form-centralizado {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: auto;
  justify-content: center;
  background: #fafbfd;
  padding: 32px 24px 32px 240px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}
.md-card {
  width: 100%;
  max-width: 1120px;
  padding: 40px 40px 32px 40px;
  box-sizing: border-box;
  border-radius: 18px;
  box-shadow: 0 6px 24px 2px #00000012;
  background: #fff;
}
.custom-card-header {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  border-radius: 14px;
}
.header-icon-title {
  display: flex;
  align-items: center;
  gap: 12px;
}
.header-icon {
  margin: 0;
  padding: 0;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.title {
  margin: 0 0 4px 0;
  font-size: 2em;
  font-weight: 600;
  color: #333;
  line-height: 1;
}
.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  margin-bottom: 24px;
}
.form-row > * {
  flex: 1 1 0;
  min-width: 200px;
}
.date-static-label {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex: 1 1 0;
}
.label-estatico {
  font-size: 1em;
  color: #888;
  margin-bottom: 4px;
  font-weight: 500;
}
.date-static-label input[type='date'].md-input,
.date-static-label input[type='time'].md-input {
  padding-top: 8px !important;
  border: none;
  border-bottom: 1px solid #ccc;
  background: transparent;
  font-size: 1em;
  color: #333;
  width: 100%;
  outline: none;
}
.actions-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 28px;
}
.md-button md-icon {
  margin-right: 8px;
}
.risk-red {
  color: #e53935 !important;
}
.risk-orange {
  color: #ffa726 !important;
}
.risk-yellow {
  color: #fbc02d !important;
}
.risk-green {
  color: #43a047 !important;
}
.risk-blue {
  color: #1e88e5 !important;
}
.success-snackbar .md-snackbar-content {
  background: #e8f5e9 !important;
  color: #43a047 !important;
  font-weight: bold;
  border-radius: 6px;
  box-shadow: 0 2px 8px #00000018;
}
.error-snackbar .md-snackbar-content {
  background: #ffebee !important;
  color: #e53935 !important;
  font-weight: bold;
  border-radius: 6px;
  box-shadow: 0 2px 8px #00000018;
}
.md-snackbar {
  position: fixed !important;
  bottom: 32px !important;
  right: 32px !important;
  z-index: 9999;
  min-width: 280px;
}
@media (max-width: 900px) {
  .form-centralizado {
    padding: 16px 2px 16px 68px;
  }
  .md-card {
    max-width: 99vw;
    padding: 18px 2vw 10px 2vw;
  }
  .form-row {
    gap: 12px;
    margin-bottom: 16px;
  }
}
@media (max-width: 600px) {
  .form-centralizado {
    padding: 0;
  }
  .md-card {
    max-width: 100vw;
    border-radius: 0;
    padding: 6vw 2vw 2vw 2vw;
    box-shadow: none;
  }
  .form-row {
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;
  }
  .form-row > * {
    min-width: 0;
  }
  .md-snackbar {
    right: 8px !important;
    bottom: 8px !important;
    left: 8px !important;
    min-width: 0;
    width: auto;
    max-width: 96vw;
  }
}
</style>
