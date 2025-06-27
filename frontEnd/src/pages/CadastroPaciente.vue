<template>
  <div class="form-centralizado">
    <md-card>
      <md-card-header class="custom-card-header">
        <span class="header-icon-title">
          <h4 class="title">Cadastro de Paciente</h4>
        </span>
      </md-card-header>
      <md-card-content>
        <form @submit.prevent="cadastrarPaciente">
          <div class="form-row">
            <md-field>
              <label for="nome">Nome</label>
              <md-input id="nome" v-model="paciente.nome" required />
            </md-field>
            <md-field>
              <label for="cpf">CPF</label>
              <md-input
                id="cpf"
                :value="paciente.cpf"
                @input="onCpfInput"
                type="text"
                maxlength="14"
                autocomplete="off"
                inputmode="numeric"
                required
              />
            </md-field>
          </div>
          <div class="form-row">
            <div class="date-static-label">
              <label class="label-estatico" for="data_nascimento">
                Data de Nascimento
              </label>
              <input
                id="data_nascimento"
                v-model="paciente.data_nascimento"
                type="date"
                class="md-input md-theme-default"
                required
              />
            </div>
            <md-field>
              <label for="genero">Gênero</label>
              <md-select id="genero" v-model="paciente.genero" required>
                <md-option value="Masculino">Masculino</md-option>
                <md-option value="Feminino">Feminino</md-option>
                <md-option value="nao-informar">Prefiro não informar</md-option>
              </md-select>
            </md-field>
          </div>
          <div class="form-row">
            <md-field>
              <label for="cep">CEP</label>
              <md-input
                id="cep"
                v-model="paciente.endereco.cep"
                @blur="buscarEndereco"
                maxlength="8"
                required
                type="text"
                inputmode="numeric"
              />
            </md-field>
            <md-field>
              <label for="rua">Rua</label>
              <md-input id="rua" v-model="paciente.endereco.rua" required />
            </md-field>
            <md-field>
              <label for="numero">Número</label>
              <md-input
                id="numero"
                v-model="paciente.endereco.numero"
                required
                type="number"
              />
            </md-field>
          </div>
          <div class="form-row">
            <md-field>
              <label for="bairro">Bairro</label>
              <md-input
                id="bairro"
                v-model="paciente.endereco.bairro"
                required
              />
            </md-field>
            <md-field>
              <label for="cidade">Cidade</label>
              <md-input
                id="cidade"
                v-model="paciente.endereco.cidade"
                required
              />
            </md-field>
            <md-field>
              <label for="estado">Estado</label>
              <md-input
                id="estado"
                v-model="paciente.endereco.estado"
                required
              />
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
        data_nascimento: '',
        genero: '',
        endereco: {
          cep: '',
          rua: '',
          numero: '',
          bairro: '',
          cidade: '',
          estado: '',
        },
      },
      loading: false,
    }
  },
  methods: {
    onCpfInput(value) {
      value = (value || '').replace(/\D/g, '').slice(0, 11)
      if (value.length > 9)
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4')
      else if (value.length > 6)
        value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3')
      else if (value.length > 3)
        value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2')
      this.paciente.cpf = value
    },
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
          // Ignora erro de consulta
        }
      }
    },
    async cadastrarPaciente() {
      const payload = {
        nome: this.paciente.nome,
        cpf: this.paciente.cpf.replace(/\D/g, ''),
        data_nascimento: this.paciente.data_nascimento,
        genero: this.paciente.genero,
        endereco: {
          rua: this.paciente.endereco.rua,
          numero: this.paciente.endereco.numero,
          bairro: this.paciente.endereco.bairro,
          cidade: this.paciente.endereco.cidade,
          estado: this.paciente.endereco.estado,
          cep: this.paciente.endereco.cep,
        },
      }
      this.loading = true
      try {
        const response = await fetch('http://localhost:3001/api/pacientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!response.ok) throw new Error('Erro ao salvar paciente')
        // Limpa o formulário antes de redirecionar
        const data = await response.json()
        const nome = this.paciente.nome
        const id = data.id
        this.paciente = {
          nome: '',
          cpf: '',
          data_nascimento: '',
          genero: '',
          endereco: {
            cep: '',
            rua: '',
            numero: '',
            bairro: '',
            cidade: '',
            estado: '',
          },
        }
        // Redireciona para feedback
        this.$router.push({ name: 'FeedBackCadastro', query: { nome, id } })
      } catch (e) {
        alert('Erro ao cadastrar: ' + e.message)
      }
      this.loading = false
    },
  },
}
</script>

<style scoped>
.form-centralizado {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-left: 15px;
  box-sizing: border-box;
  background: #f5f5f5;
}

.md-card {
  width: 100%;
  max-width: 800px;
  min-width: 420px;
  box-shadow: 0 8px 24px rgba(33, 150, 243, 0.07),
    0 1.5px 6px rgba(33, 150, 243, 0.08);
  border-radius: 14px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 18px;
}
.form-row > * {
  flex: 1;
}
.header-icon-title {
  display: flex;
  align-items: center;
  gap: 14px;
}
.custom-card-header {
  background:rgb(33, 150, 243);
  border-bottom: 2px solidrgb(33, 150, 243);
  padding: 24px 28px 18px 28px;
  border-radius: 14px;
}
.title {
  margin: 0;
  font-size: 26px;
  color: #222;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.actions-row {
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
}
.date-static-label {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.label-estatico {
  margin-bottom: 4px;
  font-weight: 500;
  color: #333;
}
.md-input,
.md-theme-default {
  background: #fff;
}
.md-field label {
  color: #333;
  font-weight: 600;
  font-size: 15px;
}
.md-button.md-primary {
  background: #2196f3;
  color: #fff;
  font-weight: 700;
  border-radius: 4px;
  min-width: 120px;
  font-size: 16px;
  transition: background 0.2s;
}
.md-button.md-primary[disabled] {
  background: #90caf9;
  color: #fff;
}
</style>
