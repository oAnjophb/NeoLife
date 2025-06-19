<template>
  <div class="form-centralizado">
    <md-card>
      <md-card-header>
        <h4 class="title">Cadastro de Paciente</h4>
      </md-card-header>
      <md-card-content>
        <form @submit.prevent="cadastrarPaciente">
          <div class="form-row">
            <md-field>
              <label>Nome</label>
              <md-input v-model="paciente.name" required />
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
              <label class="label-estatico" for="birthDate">Data de Nascimento</label>
              <input
                id="birthDate"
                v-model="paciente.birthDate"
                type="date"
                class="md-input md-theme-default"
                required
              />
            </div>
            <md-field>
              <label>Gênero</label>
              <md-select v-model="paciente.gender" required>
                <md-option value="M">Masculino</md-option>
                <md-option value="F">Feminino</md-option>
                <md-option value="nao-informar">Não informar</md-option>
              </md-select>
            </md-field>
            <div class="date-static-label">
              <label class="label-estatico" for="entryDate">Data do Cadastro</label>
              <input
                id="entryDate"
                v-model="paciente.entryDate"
                type="date"
                class="md-input md-theme-default"
                required
              />
            </div>
          </div>
          <div class="form-row">
            <md-field>
              <label>CEP</label>
              <md-input
                v-model="paciente.cep"
                @blur="buscarEndereco"
                maxlength="8"
                required
              />
            </md-field>
            <md-field>
              <label>Rua</label>
              <md-input v-model="paciente.street" required />
            </md-field>
            <md-field>
              <label>Número</label>
              <md-input v-model="paciente.number" required />
            </md-field>
          </div>
          <div class="form-row">
            <md-field>
              <label>Bairro</label>
              <md-input v-model="paciente.neighborhood" required />
            </md-field>
            <md-field>
              <label>Cidade</label>
              <md-input v-model="paciente.city" required />
            </md-field>
            <md-field>
              <label>Estado</label>
              <md-input v-model="paciente.state" required />
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
    const today = new Date().toISOString().slice(0, 10)
    return {
      paciente: {
        name: '',
        cpf: '',
        birthDate: '',
        gender: '',
        entryDate: today,
        cep: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
      },
    }
  },
  methods: {
    async buscarEndereco() {
      if (this.paciente.cep.length === 8) {
        try {
          const response = await fetch(
            `https://viacep.com.br/ws/${this.paciente.cep}/json/`
          )
          const data = await response.json()
          if (!data.erro) {
            this.paciente.street = data.logradouro || ''
            this.paciente.neighborhood = data.bairro || ''
            this.paciente.city = data.localidade || ''
            this.paciente.state = data.uf || ''
          }
        } catch (error) {
          // Se der erro, ignora
        }
      }
    },
    cadastrarPaciente() {
      alert('Paciente cadastrado!\n' + JSON.stringify(this.paciente, null, 2))
      // Limpa o formulário
      const today = new Date().toISOString().slice(0, 10)
      this.paciente = {
        name: '',
        cpf: '',
        birthDate: '',
        gender: '',
        entryDate: today,
        cep: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
      }
    },
  },
}
</script>

<style>
.form-centralizado {
  min-height: calc(100vh - 64px); /* 64px para possível navbar/header */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
  background: #fafbfd;
  width: 100%;
}

.md-card {
  width: 100%;
  max-width: 1200px;
  padding: 32px 32px 24px 32px;
  box-sizing: border-box;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  margin-bottom: 18px;
}

.form-row > * {
  flex: 1 1 0;
  min-width: 180px;
}

.date-static-label {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-bottom: 0;
  flex: 1 1 0;
}

.label-estatico {
  font-size: 1em;
  color: #888;
  margin-bottom: 4px;
  display: block;
  font-weight: 500;
}

.date-static-label input[type="date"].md-input {
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
  margin-top: 30px;
}
</style>