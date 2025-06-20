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
                v-model="paciente.data_Nascimento"
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
                v-model="paciente.endereco.cep"
                @blur="buscarEndereco"
                maxlength="8"
                required
                type="text"
              />
            </md-field>
            <md-field>
              <label>Rua</label>
              <md-input v-model="paciente.endereco.rua" required />
            </md-field>
            <md-field>
              <label>Número</label>
              <md-input v-model="paciente.endereco.numero" required type="number" />
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
            <md-button class="md-primary" type="submit" :disabled="loading">
              <span v-if="loading">Cadastrando...</span>
              <span v-else>Cadastrar</span>
            </md-button>
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
        data_Nascimento: '',
        genero: '',
        endereco: {
          cep: '',
          rua: '',
          numero: '',
          bairro: '',
          cidade: '',
          estado: '',
        }
      },
      loading: false,
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
    async cadastrarPaciente() {
      // Ajuste para os nomes dos campos esperados no backend
      const payload = {
        nome: this.paciente.nome,
        CPF: this.paciente.cpf,
        data_Nascimento: this.paciente.data_Nascimento,
        genero: this.paciente.genero,
        endereco: {
          rua: this.paciente.endereco.rua,
          numero: this.paciente.endereco.numero,
          bairro: this.paciente.endereco.bairro,
          cidade: this.paciente.endereco.cidade,
          estado: this.paciente.endereco.estado,
          cep: this.paciente.endereco.cep
        }
      }
      this.loading = true;
      try {
        const response = await fetch('http://localhost:3001/api/pacientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Erro ao salvar paciente');
        alert('Paciente cadastrado com sucesso!\n');
        // Limpa o formulário
        this.paciente = {
          nome: '',
          cpf: '',
          data_Nascimento: '',
          genero: '',
          endereco: {
            cep: '',
            rua: '',
            numero: '',
            bairro: '',
            cidade: '',
            estado: '',
          }
        }
      } catch (e) {
        alert('Erro ao cadastrar: ' + e.message);
      }
      this.loading = false;
    },
  },
}
</script>