<template>
  <div class="form-centralizado">
    <md-card>
      <md-card-header class="custom-card-header">
        <span class="header-icon-title">
          <md-icon class="header-icon" style="font-size: 32px; color: #2196f3">person_add</md-icon>
          <h4 class="title">Cadastro de Paciente</h4>
        </span>
      </md-card-header>
      <md-card-content>
        <form @submit.prevent="cadastrarPaciente">
          <div class="form-row">
            <md-field>
              <label>Nome</label>
              <md-input v-model="paciente.nome" required />
            </md-field>
            <md-field>
              <label>CPF</label>
              <md-input
                v-model="paciente.cpf"
                type="text"
                required
                maxlength="11"
              />
            </md-field>
          </div>
          <div class="form-row">
            <div class="date-static-label">
              <label class="label-estatico" for="data_nascimento">Data de Nascimento</label>
              <input
                id="data_nascimento"
                v-model="paciente.data_nascimento"
                type="date"
                class="md-input md-theme-default"
                required
              />
            </div>
            <md-field>
              <label>Gênero</label>
              <md-select v-model="paciente.genero" required>
                <md-option value="M">Masculino</md-option>
                <md-option value="F">Feminino</md-option>
                <md-option value="nao-informar">Não informar</md-option>
              </md-select>
            </md-field>
          </div>
          <div class="form-row">
            <md-field>
              <label>CEP</label>
              <md-input
                v-model.number="paciente.endereco.cep"
                @blur="buscarEndereco"
                maxlength="8"
                required
                type="number"
              />
            </md-field>
            <md-field>
              <label>Rua</label>
              <md-input v-model="paciente.endereco.rua" required />
            </md-field>
            <md-field>
              <label>Número</label>
              <md-input v-model.number="paciente.endereco.numero" required type="number" />
            </md-field>
          </div>
          <div class="form-row">
            <md-field>
              <label>Bairro</label>
              <md-input v-model="paciente.endereco.bairro" required />
            </md-field>
            <md-field>
              <label>Cidade</label>
              <md-input v-model="paciente.endereco.cidade" required />
            </md-field>
            <md-field>
              <label>Estado</label>
              <md-input v-model="paciente.endereco.estado" required />
            </md-field>
          </div>
          <div class="actions-row">
            <md-button class="md-primary" type="submit">Cadastrar</md-button>
          </div>
        </form>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
export default {
  name: 'CadastroPaciente',
  data() {
    return {
      paciente: {
        nome: '',
        cpf: '',
        data_nascimento: '',
        genero: '',
        endereco: {
          cep: null,
          rua: '',
          numero: null,
          bairro: '',
          cidade: '',
          estado: '',
        }
      },
    }
  },
  methods: {
    async buscarEndereco() {
      if (
        this.paciente.endereco.cep &&
        this.paciente.endereco.cep.toString().length === 8
      ) {
        try {
          const response = await fetch(
            `https://viacep.com.br/ws/${this.paciente.endereco.cep}/json/`
          )
          const data = await response.json()
          if (!data.erro) {
            this.paciente.endereco.rua = data.logradouro || ''
            this.paciente.endereco.bairro = data.bairro || ''
            this.paciente.endereco.cidade = data.localidade || ''
            this.paciente.endereco.estado = data.uf || ''
          }
        } catch (error) {
          // Se der erro, ignora
        }
      }
    },
    cadastrarPaciente() {
      // Monta o payload já no formato esperado pelo back-end
      const payload = {
        nome: this.paciente.nome,
        cpf: this.paciente.cpf,
        data_nascimento: this.paciente.data_nascimento,
        genero: this.paciente.genero,
        endereco: { ...this.paciente.endereco }
      }
      alert('Paciente cadastrado!\n' + JSON.stringify(payload, null, 2))
      // Limpa o formulário
      this.paciente = {
        nome: '',
        cpf: '',
        data_nascimento: '',
        genero: '',
        endereco: {
          cep: null,
          rua: '',
          numero: null,
          bairro: '',
          cidade: '',
          estado: '',
        }
      }
    },
  },
}
</script>

<style>
.form-centralizado {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: #fafbfd;
  padding: 24px;
  width: 100vw;
  box-sizing: border-box;
  overflow-x: hidden;
}
.md-card {
  width: 100vw;
  max-width: 1300px;
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

@media (max-width: 1500px) {
  .md-card {
    max-width: 99vw;
    padding: 18px 2vw 10px 2vw;
  }
  .form-row {
    gap: 12px;
    margin-bottom: 16px;
  }
}

@media (max-width: 900px) {
  .md-card {
    max-width: 100vw;
    padding: 14px 1vw 8px 1vw;
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