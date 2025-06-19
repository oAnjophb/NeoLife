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