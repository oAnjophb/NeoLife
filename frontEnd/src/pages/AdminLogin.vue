<!-- src/pages/AdminLogin.vue -->
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
        <md-input v-model="senha" type="password" required autocomplete="current-password"></md-input>
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
  name: "AdminLogin",
  data() {
    return {
      usuario: "",
      senha: "",
      loading: false,
      erro: ""
    };
  },
  methods: {
    async doAdminLogin() {
      this.erro = "";
      this.loading = true;

      // Simule autenticação admin (troque pelo seu backend depois)
      setTimeout(() => {
        this.loading = false;
        if (this.usuario === "admin" && this.senha === "admin123") {
          localStorage.setItem("usuario", JSON.stringify({
            usuario: this.usuario,
            tipo: "admin"
          }));
          this.$router.push("/cadastro-funcionario");
        } else {
          this.erro = "Usuário ou senha inválidos!";
        }
      }, 800);
    }
  }
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
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.13);
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