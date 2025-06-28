<template>
  <div class="register-container">
    <form class="register-card" @submit.prevent="doRegister">
      <h2>Cadastrar Usuário</h2>

      <md-field>
        <label>Tipo de usuário</label>
        <md-select v-model="tipo" required>
          <md-option value="medico">Médico</md-option>
          <md-option value="enfermeiro">Enfermeiro</md-option>
          <md-option value="recepcionista">Recepcionista</md-option>
        </md-select>
      </md-field>

      <md-field>
        <label>Nome</label>
        <md-input v-model="nome" required maxlength="100"></md-input>
      </md-field>

      <md-field>
        <label>CPF</label>
        <md-input
          v-model="cpf"
          required
          maxlength="11"
          minlength="11"
          type="text"
          pattern="\d{11}"
          placeholder="Só números"
          @input="cpf = cpf.replace(/\D/g, '')"
        ></md-input>
      </md-field>

      <md-field v-if="tipo === 'medico'">
        <label>CRM</label>
        <md-input v-model="crm" required maxlength="15"></md-input>
      </md-field>
      <md-field v-if="tipo === 'enfermeiro'">
        <label>COREN</label>
        <md-input v-model="coren" required maxlength="15"></md-input>
      </md-field>

      <md-field>
        <label>Senha</label>
        <md-input
          v-model="senha"
          required
          type="password"
          minlength="6"
          maxlength="20"
        ></md-input>
      </md-field>

      <md-button class="md-raised md-primary" type="submit" :disabled="loading">
        {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
      </md-button>
      <p v-if="erro" class="erro-msg">{{ erro }}</p>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      tipo: '',
      nome: '',
      cpf: '',
      crm: '',
      coren: '',
      senha: '',
      loading: false,
      erro: '',
    }
  },
  methods: {
    async doRegister() {
      this.erro = ''
      this.loading = true

      if (!this.tipo) {
        this.erro = 'Selecione o tipo de usuário.'
        this.loading = false
        return
      }
      if (!this.nome || this.nome.length > 100) {
        this.erro = 'Nome deve ser preenchido e ter no máximo 100 caracteres.'
        this.loading = false
        return
      }
      if (!/^\d{11}$/.test(this.cpf)) {
        this.erro = 'CPF deve conter exatamente 11 números.'
        this.loading = false
        return
      }
      if (this.tipo === 'medico' && (!this.crm || this.crm.length > 15)) {
        this.erro = 'CRM deve ser preenchido e ter no máximo 15 caracteres.'
        this.loading = false
        return
      }
      if (
        this.tipo === 'enfermeiro' &&
        (!this.coren || this.coren.length > 15)
      ) {
        this.erro = 'COREN deve ser preenchido e ter no máximo 15 caracteres.'
        this.loading = false
        return
      }
      if (!this.senha || this.senha.length < 6 || this.senha.length > 20) {
        this.erro = 'Senha deve ter entre 6 e 20 caracteres.'
        this.loading = false
        return
      }

      let payload = {
        tipo: this.tipo,
        nome: this.nome,
        cpf: this.cpf,
        senha: this.senha,
      }
      if (this.tipo === 'medico') payload.crm = this.crm
      if (this.tipo === 'enfermeiro') payload.coren = this.coren

      try {
        const resp = await fetch('http://localhost:3001/api/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!resp.ok) {
          const errData = await resp.json()
          this.erro = errData.erro || 'Erro ao cadastrar funcionário.'
          this.loading = false
          return
        }
        const data = await resp.json()
        this.loading = false
        this.$router.push({
          name: 'RegisterFeedback',
          params: { id: data.dbId || data.jsonId },
        })
      } catch (e) {
        this.erro = 'Erro de conexão com o servidor.'
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f5f8;
}
.register-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.13);
  padding: 36px 32px 28px 32px;
  width: 100%;
  max-width: 350px;
  text-align: center;
}
.md-field {
  width: 100%;
  margin-bottom: 16px;
}
.erro-msg {
  color: #e74c3c;
  margin-top: 14px;
  font-size: 1em;
}
</style>
