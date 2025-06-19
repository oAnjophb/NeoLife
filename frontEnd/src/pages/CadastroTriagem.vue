<template>
  <div class="form-centralizado">
    <md-card>
      <md-card-header class="custom-card-header">
        <md-icon class="header-icon" style="font-size: 32px; color: #2196f3">assignment</md-icon>
        <h4 class="title">Cadastro de Triagem</h4>
      </md-card-header>
      <md-card-content>
        <form @submit.prevent="cadastrarTriagem">
          <div class="form-row">
            <md-field>
              <label>Paciente</label>
              <md-input v-model="triagem.paciente" placeholder="Nome do paciente" required />
            </md-field>
          </div>
          <div class="form-row">
            <div class="date-static-label">
              <label class="label-estatico" for="dataTriagem">Data da Triagem</label>
              <input
                id="dataTriagem"
                v-model="triagem.dataTriagem"
                type="date"
                class="md-input md-theme-default"
                required
              />
            </div>
            <div class="date-static-label">
              <label class="label-estatico" for="horaTriagem">Hora da Triagem</label>
              <input
                id="horaTriagem"
                v-model="triagem.horaTriagem"
                type="time"
                class="md-input md-theme-default"
                required
              />
            </div>
            <md-field>
              <label>Classificação Manchester</label>
              <md-select v-model="triagem.classificacaoRisco" required>
                <md-option value="vermelho" class="risk-red">Vermelho (emergência)</md-option>
                <md-option value="laranja" class="risk-orange">Laranja (muito urgente)</md-option>
                <md-option value="amarelo" class="risk-yellow">Amarelo (urgente)</md-option>
                <md-option value="verde" class="risk-green">Verde (pouco urgente)</md-option>
                <md-option value="azul" class="risk-blue">Azul (não urgente)</md-option>
              </md-select>
            </md-field>
          </div>
          <div class="form-row">
            <md-field>
              <label>Pressão Arterial</label>
              <md-input v-model="triagem.pressaoArterial" placeholder="Ex: 120/80" />
            </md-field>
            <md-field>
              <label>Temperatura (°C)</label>
              <md-input v-model="triagem.temperatura" type="number" step="0.1" placeholder="Ex: 36.5" />
            </md-field>
            <md-field>
              <label>Saturação O₂ (%)</label>
              <md-input v-model="triagem.saturacao" type="number" placeholder="Ex: 98" />
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
        paciente: '',
        dataTriagem: today,
        horaTriagem: now,
        classificacaoRisco: '',
        pressaoArterial: '',
        temperatura: '',
        saturacao: '',
        sintomas: '',
      },
    }
  },
  methods: {
    cadastrarTriagem() {
      alert('Triagem salva!\n' + JSON.stringify(this.triagem, null, 2))
      // Limpa o formulário
      const today = new Date().toISOString().slice(0, 10)
      const now = new Date().toISOString().slice(11, 16)
      this.triagem = {
        paciente: '',
        dataTriagem: today,
        horaTriagem: now,
        classificacaoRisco: '',
        pressaoArterial: '',
        temperatura: '',
        saturacao: '',
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
  width: 100%; /* Corrigido aqui */
  box-sizing: border-box;
  overflow-x: hidden; /* impede scroll lateral */
}
.md-card {
  width: 100%;
  max-width: 800px;  /* Ajuste aqui para o tamanho que quiser */
  padding: 40px 40px 32px 40px;
  box-sizing: border-box;
  border-radius: 18px;
  box-shadow: 0 6px 24px 2px #00000012;
  background: #fff;
}
.custom-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
}
.header-icon {
  margin-right: 8px;
}
.title {
  margin: 0 0 4px 0;
  font-size: 2em;
  font-weight: 600;
  color: #333;
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