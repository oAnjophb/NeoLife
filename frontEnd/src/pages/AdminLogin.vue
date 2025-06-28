
<template>
  <div class="admin-login-container">
    <form class="login-card" @submit.prevent="doAdminLogin">
      <h2>Login Admin</h2>
      <md-field>
        <label>Usuário</label>
        <md-input v-model="usuario" required autocomplete="username"></md-input>
      </md-field>
      <md-field>
        <label>Senha</label>
        <md-input
          v-model="senha"
          type="password"
          required
          autocomplete="current-password"
        ></md-input>
      </md-field>
      <md-button class="md-raised md-primary" type="submit" :disabled="loading">
        {{ loading ? 'Entrando...' : 'Entrar como admin' }}
      </md-button>
      <p v-if="erro" class="erro-msg">{{ erro }}</p>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AdminLogin',
  data() {
    return {
      usuario: '',
      senha: '',
      loading: false,
      erro: '',
    }
  },
  methods: {
    async doAdminLogin() {
      this.erro = ''
      this.loading = true
      try {
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuario: this.usuario,
            senha: this.senha,
          }),
        })
        const data = await response.json()
        this.loading = false
        if (response.ok) {
          localStorage.setItem(
            'usuario',
            JSON.stringify({
              usuario: data.usuario,
              tipo: 'admin',
            })
          )
          this.$router.push('/cadastro-funcionario')
        } else {
          this.erro = data.erro || 'Usuário ou senha inválidos!'
        }
      } catch (err) {
        this.loading = false
        this.erro = 'Erro ao conectar ao servidor!'
      }
    },
  },
}
</script>

<style scoped>
.admin-login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f5f8;
}
.login-card {
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
