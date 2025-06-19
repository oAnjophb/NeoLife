<template>
  <div class="form-centralizado">
    <md-card>
      <md-card-header class="custom-card-header">
        <span class="header-icon-title">
          <md-icon class="header-icon" style="font-size: 32px; color: #2196f3">assignment</md-icon>
          <h4 class="title">Cadastro de Triagem</h4>
        </span>
      </md-card-header>
      <md-card-content>
        <form @submit.prevent="cadastrarTriagem">
          <div class="form-row">
            <md-field>
              <label>ID do Paciente</label>
              <md-input v-model.number="triagem.id_paciente" placeholder="ID do paciente" required />
            </md-field>
          </div>
          <div class="form-row">
            <div class="date-static-label">
              <label class="label-estatico" for="data_triagem">Data da Triagem</label>
              <input
                id="data_triagem"
                v-model="triagem.data_triagem"
                type="date"
                class="md-input md-theme-default"
                required
              />
            </div>
            <div class="date-static-label">
              <label class="label-estatico" for="hora_triagem">Hora da Triagem</label>
              <input
                id="hora_triagem"
                v-model="triagem.hora_triagem"
                type="time"
                class="md-input md-theme-default"
                required
              />
            </div>
            <md-field>
              <label>Classificação Manchester</label>
              <md-select v-model.number="triagem.id_classificacao_risco" required>
                <md-option :value="1" class="risk-red">Vermelho (emergência)</md-option>
                <md-option :value="2" class="risk-orange">Laranja (muito urgente)</md-option>
                <md-option :value="3" class="risk-yellow">Amarelo (urgente)</md-option>
                <md-option :value="4" class="risk-green">Verde (pouco urgente)</md-option>
                <md-option :value="5" class="risk-blue">Azul (não urgente)</md-option>
              </md-select>
            </md-field>
          </div>
          <div class="form-row">
            <md-field>
              <label>Pressão Sanguínea (mmHg)</label>
              <md-input v-model.number="triagem.pressao_sanguinea" type="number" placeholder="Ex: 120" />
            </md-field>
            <md-field>
              <label>Temperatura (°C)</label>
              <md-input v-model.number="triagem.temperatura" type="number" step="0.1" placeholder="Ex: 36.5" />
            </md-field>
            <md-field>
              <label>Saturação O₂ (%)</label>
              <md-input v-model.number="triagem.saturacao" type="number" placeholder="Ex: 98" />
            </md-field>
          </div>
          <div class="form-row">
            <md-field>
              <label>Sintomas</label>
              <md-input v-model="triagem.sintomas" placeholder="Descreva os sintomas do paciente" />
            </md-field>
          </div>
          <div class="actions-row">
            <md-button class="md-primary" type="submit">
              Salvar Triagem
            </md-button>
          </div>
        </form>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
export default {
  name: 'CadastroTriagem',
  data() {
    const today = new Date().toISOString().slice(0, 10)
    const now = new Date().toISOString().slice(11, 16)
    return {
      triagem: {
        id_paciente: null,
        data_triagem: today,
        hora_triagem: now,
        id_classificacao_risco: null,
        pressao_sanguinea: null,
        temperatura: null,
        saturacao: null,
        sintomas: '',
      },
    }
  },
  methods: {
    cadastrarTriagem() {
      // Junta data e hora em data_triagem (formato ISO)
      let dataHoraTriagem = this.triagem.data_triagem;
      if (this.triagem.hora_triagem) {
        dataHoraTriagem += 'T' + this.triagem.hora_triagem;
      }
      const payload = {
        id_paciente: this.triagem.id_paciente,
        data_triagem: dataHoraTriagem,
        id_classificacao_risco: this.triagem.id_classificacao_risco,
        sintomas: this.triagem.sintomas,
        temperatura: this.triagem.temperatura,
        saturacao: this.triagem.saturacao,
        pressao_sanguinea: this.triagem.pressao_sanguinea,
      }
      alert('Triagem salva!\n' + JSON.stringify(payload, null, 2))
      // Limpa o formulário
      const today = new Date().toISOString().slice(0, 10)
      const now = new Date().toISOString().slice(11, 16)
      this.triagem = {
        id_paciente: null,
        data_triagem: today,
        hora_triagem: now,
        id_classificacao_risco: null,
        pressao_sanguinea: null,
        temperatura: null,
        saturacao: null,
        sintomas: '',
      }
    },
  },
}
</script>

<style>
.form-centralizado {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafbfd;
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}
.md-card {
  width: 100%;
  max-width: 800px;
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
  /* Remove o gap padrão */
}
.header-icon-title {
  display: flex;
  align-items: center;
  gap: 12px; /* Espaço exato entre ícone e título */
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
.date-static-label input[type="date"].md-input,
.date-static-label input[type="time"].md-input {
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
.risk-red { color: #e53935 !important; }
.risk-orange { color: #ffa726 !important; }
.risk-yellow { color: #fbc02d !important; }
.risk-green { color: #43a047 !important; }
.risk-blue { color: #1e88e5 !important; }

@media (max-width: 900px) {
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
}
</style>